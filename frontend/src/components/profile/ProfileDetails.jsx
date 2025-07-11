import Card from "../Card";
import { useAuth } from "../../hooks/useAuth";

function ProfileDetails() {
    const { user } = useAuth();
    return (
        <Card>
            <h2>Account Information</h2>
            <p><strong>Username:</strong> {user?.username}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Roles:</strong> {user?.roles?.join(', ')}</p>
        </Card>
    );
}

export default ProfileDetails;