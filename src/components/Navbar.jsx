//assets
// import icon from '../assets/table.svg'
import icon from "../../public/favicon.ico";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between">
      <h1 className="text-2xl font-light">Blaaiz</h1>
      <img src={icon} alt="" />
    </nav>
  )
}
