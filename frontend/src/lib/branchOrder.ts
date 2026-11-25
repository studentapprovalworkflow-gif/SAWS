const BRANCH_ORDER = [
  'MANJERI',
  'KASARGODE',
  'KANNUR',
  'KUTTIYADI',
  'CALICUT',
  'TIRUR',
  'PALAKAD',
  'THRISSUR',
  'ERNAKULAM',
  'ALAPPUZHA',
  'KOTTAYAM',
  'KOLLAM',
  'ATTINGAL',
  'MARTHANDAM',
  'NAGPUR',
  'HYDERABAD',
  'BANGALORE'
] as const;

const BRANCH_ALIASES: Record<string, string> = {
  KASARGOD: 'KASARGODE',
  KUTTYADI: 'KUTTIYADI',
  KOZHIKODE: 'CALICUT',
  PALAKKAD: 'PALAKAD',
  ERANAKULAM: 'ERNAKULAM',
  TRIVANDRUM: 'ATTINGAL'
};

const BRANCH_RANK = new Map<string, number>(BRANCH_ORDER.map((branch, index) => [branch, index]));

export function compareBranchNames(a: string, b: string): number {
  const aName = a.trim().toUpperCase();
  const bName = b.trim().toUpperCase();
  const aCanonical = BRANCH_ALIASES[aName] || aName;
  const bCanonical = BRANCH_ALIASES[bName] || bName;
  const aRank = BRANCH_RANK.get(aCanonical) ?? BRANCH_ORDER.length;
  const bRank = BRANCH_RANK.get(bCanonical) ?? BRANCH_ORDER.length;
  return aRank - bRank || aName.localeCompare(bName);
}

export function sortBranchNames(names: string[]): string[] {
  return [...names].sort(compareBranchNames);
}
