"""
audit_log.py
Append-only log of security-relevant actions. Direct port of AuditLog.gs.
"""
from datetime import datetime, timezone

import config
from db_utils import append_row_, invalidate_cache_, read_sheet_as_objects_


def log_audit_(user_email, action, details, branch, browser):
    append_row_(config.SHEET_AUDITLOGS, {
        'Timestamp': datetime.now(timezone.utc).isoformat(timespec='seconds'),
        'User Email': user_email or '',
        'Action': action or '',
        'Details': details or '',
        'Branch': branch or '',
        'Browser': browser or '',
    })
    branch_name = str(branch or '').strip()
    normalized_branch = ' '.join(
        branch_name.replace('_', ' ').replace('-', ' ').upper().split()
    )
    if (
        str(action or '').strip().upper() in {'CREATE', 'UPDATE', 'STAGE_TRANSITION'}
        and branch_name
        and normalized_branch != 'HEAD OFFICE'
    ):
        invalidate_cache_(['dashboard_ALL', 'dashboard_' + branch_name])


def get_audit_logs_(branch_filter):
    """
    Returns audit log rows, optionally filtered by branch (non-Admins
    should only ever be passed their own branch by the router).
    """
    rows = read_sheet_as_objects_(config.SHEET_AUDITLOGS)
    filtered = [r for r in rows if r.get('Branch') == branch_filter] if branch_filter else rows
    filtered.sort(key=lambda r: r.get('Timestamp') or '', reverse=True)
    return [
        {
            'timestamp': r.get('Timestamp'),
            'userEmail': r.get('User Email'),
            'action': r.get('Action'),
            'details': r.get('Details'),
            'branch': r.get('Branch'),
            'browser': r.get('Browser'),
        }
        for r in filtered
    ]
