import { AppRouter } from './routes/AppRouter'
import { Toast } from '@heroui/react'
import './App.css'

function App() {
  return (
    <>
      <Toast.Provider />
      <AppRouter />
    </>
  );
}

export default App
