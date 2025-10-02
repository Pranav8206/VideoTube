import React from "react";
import PlaylistCard from "./PlaylistCard";

const PlaylistGrid = ({ playlists, layout = "list", searchQuery = "" }) => {
  const filteredPlaylist = playlists.filter((playlist) =>
    playlist.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      <div
        className={
          layout == "grid"
            ? "grid gap-4 s:gap-2 sm:gap-6 grid-cols-1 s:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 "
            : "w-full flex flex-col gap-2  "
        }
      >
        {filteredPlaylist.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-16 text-lg font-medium">
            This channel hasn’t created any playlists.
          </div>
        ) : (
          filteredPlaylist.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              layout={layout}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PlaylistGrid;
