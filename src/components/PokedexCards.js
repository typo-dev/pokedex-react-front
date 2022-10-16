import React from "react";

const pokedexCards = ({ id, name, sprite, types }) => {
  id = id.toString().padStart(3, "0");
  const mainDivName = `pokecard pokecard__container ${types[0]}`;
  types = types[0] + " " + types[1];

  return (
    <div className={mainDivName}>
      <div className="pokecard__id">
        <p>#{id}</p>
      </div>
      <img src={sprite} alt={name}></img>
      <div className="pokecard__info info__wrapper">
        <h1>{name}</h1>
        <p>Type: {types}</p>
      </div>
    </div>
  );
};

export default pokedexCards;
