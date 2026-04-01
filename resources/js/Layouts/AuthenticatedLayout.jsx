
import AppLayout from './AppLayout';


export default function AuthenticatedLayout({ user, children }) {

    return (<AppLayout {...{user, children}} />)


}
