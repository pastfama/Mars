import React, { createContext, useState, useContext } from 'react';

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
  const [player, setPlayer] = useState(null);

  const setPlayerInfo = (info) => setPlayer(info);

  return (
    <PlayerContext.Provider value={{ player, setPlayerInfo }}>
      {children}
    </PlayerContext.Provider>
  );
};
