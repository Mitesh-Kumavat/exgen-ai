import { useEffect } from "react";
import { useNavigate } from "react-router-dom"

const App = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/login', { replace: true });
  }, [])

  return (
    <div>App</div>
  )
}

export default App