import unittest
from unittest.mock import patch

import branches


class BranchDisplayOrderTests(unittest.TestCase):
    def test_branch_dropdown_list_uses_requested_order_and_keeps_other_names_afterward(self):
        rows = [
            {'Branch Name': 'BANGALORE', 'Active': True},
            {'Branch Name': 'MANJERI', 'Active': True},
            {'Branch Name': 'KOZHIKODE', 'Active': True},
            {'Branch Name': 'KASARGOD', 'Active': True},
            {'Branch Name': 'TIRUR', 'Active': True},
            {'Branch Name': 'ZETA', 'Active': True},
            {'Branch Name': 'ALPHA', 'Active': True},
            {'Branch Name': 'INACTIVE', 'Active': False},
        ]
        with patch.object(branches, 'read_sheet_as_objects_', return_value=rows):
            result = branches.list_branches_(False)

        self.assertEqual(
            [branch['name'] for branch in result],
            ['MANJERI', 'KASARGOD', 'KOZHIKODE', 'TIRUR', 'BANGALORE', 'ALPHA', 'ZETA'],
        )


if __name__ == '__main__':
    unittest.main()
