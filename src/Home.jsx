import {Link} from "react-router-dom";

function Home() {
    return (
        <div>
            <h1>Home</h1>
            <Link to="/vendas">
            <button>Ver grafico de vendas</button>
            </Link>
        </div>
    );
};

export default Home;