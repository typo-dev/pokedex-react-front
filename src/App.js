import { useState, useEffect } from "react";
import PokedexCards from "./components/PokedexCards";
import Axios from "axios";

function App() {
  const [pokemonsArr, setPokemonsArr] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:5000/getPokemons").then((resp) => {
      const tempArr = resp.data;
      tempArr.sort(compareId);
      setPokemonsArr(tempArr);
    });
  }, []);

  const postPokemons = (arr) => {
    // note it checks if document with the pokemon.id exists in the DB,
    // if so, it does not post. if you want to add more info to pokemon object,
    // have to change backend code and replace current db documents, or directly modify each document in db.
    arr.forEach((pokemon) => {
      Axios.post("http://localhost:5000/postPokemons", pokemon).then((resp) => {
        console.log(`Pokemon ${pokemon.id} post request sent`);
      });
    });
  };

  const compareId = (obj1, obj2) => {
    if (obj1.id >= obj2.id) {
      return 1;
    } else if (obj1.id < obj2.id) {
      return -1;
    }
    return 0;
  };

  const createPokemonObject = async (results) => {
    let tempArr = pokemonsArr.slice();
    await Promise.all(
      results.map(async (pokemon) => {
        const response = await fetch(pokemon.url);
        const data = await response.json();
        const editedData = {
          id: data.id,
          name: data.name,
          sprite: data.sprites.front_default,
          types: [data.types[0].type.name, ""],
        };

        if (data.types[1]) {
          editedData.types[1] = data.types[1].type.name;
        }

        tempArr[editedData.id - 1] = editedData;
      })
    );

    postPokemons(tempArr);
    setPokemonsArr(tempArr);
  };
  const getPokemons = async () => {
    const gen = document.getElementById("generation-select").value;
    let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");

    switch (+gen) {
      case 1:
        response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
        break;

      case 2:
        response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?offset=151&limit=100"
        );
        break;

      case 3:
        response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?offset=251&limit=135"
        );
        break;

      case 4:
        response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?offset=386&limit=107"
        );
        break;

      case 5:
        response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?offset=493&limit=156"
        );
        break;

      case 6:
        response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?offset=649&limit=72"
        );
        break;

      case 7:
        response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?offset=721&limit=88"
        );
        break;

      default:
        break;
    }
    const data = await response.json();

    createPokemonObject(data.results);
  };

  const renderPokeCard = (arr) => {
    return arr.map((pokemon, index) => {
      return (
        <PokedexCards
          id={pokemon.id}
          name={pokemon.name}
          sprite={pokemon.sprite}
          types={pokemon.types[0] + " " + pokemon.types[1]}
          key={index}
        />
      );
    });
  };

  return (
    <div className="app-container">
      <h1>PokeDex</h1>
      <select id="generation-select">
        <option value="1">Generation I</option>
        <option value="2">Generation II</option>
        <option value="3">Generation III</option>
        <option value="4">Generation IV</option>
        <option value="5">Generation V</option>
        <option value="6">Generation VI</option>
        <option value="7">Generation VII</option>
      </select>
      <button id="load-button" className="load-button" onClick={getPokemons}>
        Post
      </button>
      <div className="pokemons-container">
        <div className="pokecards-container">{renderPokeCard(pokemonsArr)}</div>
      </div>
    </div>
  );
}

export default App;
