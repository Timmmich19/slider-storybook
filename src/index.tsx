import {createRoot} from 'react-dom/client'
import './styles/main.scss'

const App = () => <div>Hello Webpack + TS + React + Storybook</div>

const container = document.getElementById('root')!
const root = createRoot(container)
root.render(<App />)