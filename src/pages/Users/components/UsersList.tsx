import { Button } from "../../../components/Button";
import { formatCPF } from "../../../utils/validation";
import type { User } from "../../../types/user";
import styles from "./UsersList.module.css";

interface UsersListProps {
  items: User[];
  currentUserId?: number;
  onEdit: (item: User) => void;
  onDelete: (item: User) => void;
  disabled?: boolean;
}

export function UsersList({
  items,
  currentUserId,
  onEdit,
  onDelete,
  disabled = false,
}: UsersListProps) {
  return (
    <div className={styles.list}>
      {items.map((user) => {
        const isSelf = currentUserId === user.id;

        return (
          <div key={user.id} className={styles.item}>
            <div className={styles.info}>
              <div className={styles.headerRow}>
                <span className={styles.name}>{user.name}</span>
                <span
                  className={`${styles.badge} ${
                    user.role === "admin" ? styles.badgeAdmin : ""
                  }`}
                >
                  {user.role}
                </span>
                {isSelf && <span className={styles.badge}>(You)</span>}
              </div>
              <span className={styles.meta}>
                {user.email} · CPF: {formatCPF(user.cpf)} · ID: {user.id}
              </span>
            </div>
            <div className={styles.actions}>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => onEdit(user)}
                disabled={disabled}
              >
                Edit
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => onDelete(user)}
                disabled={disabled}
              >
                Delete
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default UsersList;
