// Formats backend enum values for display: "NIGHT_ELF" -> "Night Elf".
export function formatEnum(raw: string): string {
  return raw
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

// Formats a whole-dollar amount for display: 17506 -> "$17,506".
export function formatCurrency(amount: number): string {
  return `$${Math.round(amount).toLocaleString("en-US")}`;
}
