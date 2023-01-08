import {useNavigate} from 'react-router-dom'

const NotFound = () => {
    const navigate = useNavigate()

    return (
        <>
            <h1>Page Not found</h1>
            <button onClick={() => navigate('dashboard')}>Go home</button>
        </>
    )
}

export default NotFound