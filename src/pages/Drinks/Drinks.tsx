import { AdminTitle } from "../../components/AdminTitle";
import { AdminCard } from "../../components/AdminCard";

export function Drinks() {
  return (
    <>
      <AdminTitle
        eyebrow="ADMIN · DRINKS"
        title="Drinks"
        description="Manage the drinks shown on the public menu."
      />

      <AdminCard
        title="Drink management"
        description="The drink list, prices, and availability controls will live here once this page is connected to the API."
      />
    </>
  );
}

export default Drinks;
