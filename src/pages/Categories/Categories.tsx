import { AdminTitle } from "../../components/AdminTitle";
import { AdminCard } from "../../components/AdminCard";

export function Categories() {
  return (
    <>
      <AdminTitle
        eyebrow="ADMIN · CATEGORIES"
        title="Categories"
        description="Group drinks so the public menu stays easy to browse."
      />

      <AdminCard
        title="Category management"
        description="The category list and organization tools will live here once this page is connected to the API."
      />
    </>
  );
}

export default Categories;
