import { AdminTitle } from "../../components/AdminTitle";
import { AdminCard } from "../../components/AdminCard";

export function Users() {
  return (
    <>
      <AdminTitle
        eyebrow="ADMIN · USERS"
        title="Users"
        description="Create, review, and remove the accounts that can access the shop."
      />

      <AdminCard
        title="User management"
        description="The user list, search, and account actions will live here once this page is connected to the API."
      />
    </>
  );
}

export default Users;
