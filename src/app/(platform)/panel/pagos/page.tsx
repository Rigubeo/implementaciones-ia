import { CreditCard } from "lucide-react";
import { PanelEmptyState } from "@/components/panel/PanelEmptyState";

export default function OneTimePaymentsPage() {
  return (
    <PanelEmptyState
      icon={CreditCard}
      title="Pagos únicos"
      description="Aquí aparecerán las órdenes de pago correspondientes a implementaciones, diagnósticos, páginas web y trabajos específicos."
      note="Cuando activemos Mercado Pago, cada orden tendrá concepto, importe, fecha límite, estado y un botón seguro para pagar."
    />
  );
}
