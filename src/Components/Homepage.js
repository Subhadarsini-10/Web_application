/* eslint-disable no-unused-vars */
import React, { useRef, useState } from "react";
import {
  Delete,
  Dot,
  Download,
  Logout,
  Next,
  Pause,
  Play,
  Previous,
  Song,
} from "./icons";
import { useLocation, useNavigate } from "react-router-dom";
import { Songs } from "./Songs";
import Modal from "react-modal";
import Draggable from "react-draggable";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Homepage = () => {
  const location = useLocation();
  // eslint-disable-next-line no-unused-vars
  const { data } = location.state || {};
  const [song, setSong] = useState(Songs);
  const [currentSong, setCurrentSong] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingSong, setPlayingSong] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const audioRef = useRef();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = song[0].songs.slice(indexOfFirstItem, indexOfLastItem);
  const [newSongData, setNewSongData] = useState({
    songName: "",
    songUrl: "",
    sourceName: "",
  });

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      opacity: "0.7",
    },
  };

  const handlePlay = (selectedSong) => {
    if (!isPlaying) {
      audioRef.current.src = selectedSong.songUrl;
      audioRef.current.play();
      setCurrentSong(selectedSong);
      setIsPlaying(true);

      setPlayingSong(selectedSong);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);

      setPlayingSong(null);
    }
  };

  const handlePause = () => {
    audioRef.current.pause();
    setCurrentSong(null);
  };

  const handleNext = () => {
    const currentIndex = currentItems.findIndex(
      (item) => item.songName === currentSong.songName
    );
    const nextIndex = (currentIndex + 1) % currentItems.length;
    const nextSong = currentItems[nextIndex];

    if (nextSong) {
      handlePlay(nextSong);
    }
  };

  const handlePrevious = () => {
    const currentIndex = currentItems.findIndex(
      (item) => item.songName === currentSong.songName
    );
    const previousIndex =
      (currentIndex - 1 + currentItems.length) % currentItems.length;
    const previousSong = currentItems[previousIndex];

    if (previousSong) {
      handlePlay(previousSong);
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const addNewSong = (newSongData) => {
    const newSong = {
      songName: newSongData.songName,
      songUrl: newSongData.songUrl,
      sourceName: newSongData.sourceName,
      addedDate: new Date().toLocaleDateString(),
    };

    setSong((prevSongs) => [{ songs: [...prevSongs[0].songs, newSong] }]);
    closeModal();
  };

  const handleDelete = (selectedSong) => {
    const updatedSongs = song[0].songs.filter(
      (song) => song.songName !== selectedSong.songName
    );
    setSong((prevSongs) => [{ songs: updatedSongs }]);
  };

  const OnLogout = () => {
    navigate("/");
    toast.dismiss();
    toast.success("User Logged out!");
  };

  return (
    <>
      <div className="flex flex-row">
        <div className="fixed top-0 left-0 h-screen w-64 flex flex-col">
          <h1 className="text-[#4c2474] text-3xl text-center font-bold p-3">
            Logo
          </h1>
          <div className="flex flex-col gap-[630px]">
            <div className="text-[#566dff] font-semibold flex items-center gap-3 px-4 h-10 bg-[#caf0ff]">
              <Song />
              <p>Songs</p>
            </div>

            <div
              onClick={OnLogout}
              className="text-[#4c2474] mt-auto px-5 flex gap-3 cursor-pointer"
            >
              <Logout />
              <p>Logout</p>
            </div>
          </div>
        </div>

        <div className="w-full ml-64 overflow-y-auto flex flex-col">
          <section className="border">
            <div className="flex justify-between p-3">
              <h1 className="font-semibold text-xl">Songs</h1>
              <div className="flex gap-2 items-center">
                <button
                  className="bg-[orange] px-3 py-1 font-semibold"
                  onClick={openModal}
                >
                  Add Songs
                </button>
                <Dot />
              </div>
            </div>
          </section>
          <div className="w-full">
            <table className="w-full border-collapse border">
              <thead className="h-20">
                <tr>
                  <th className="text-start pl-3">SONG NAME</th>
                  <th>SOURCE</th>
                  <th>ADDED ON</th>
                  <th className="text-[white]">ACTIONS</th>
                  <th className="text-[white]">DELETE</th>
                </tr>
              </thead>
              <tbody>
                {song[0].songs.map((song) => (
                  <tr key={song.songName} className="text-center">
                    <td className="text-start p-4 gap-3 items-center flex border">
                      <img alt="" src={song.image} className="w-8 h-8" />
                      {song.songName}
                    </td>
                    <td className="border">{song.sourceName}</td>
                    <td className="border">{song.addedDate}</td>
                    <td className="border">
                      <button onClick={() => handlePlay(song)}>
                        {playingSong === song && isPlaying ? (
                          <Pause />
                        ) : (
                          <Play />
                        )}
                      </button>
                    </td>
                    <td className="border">
                      <button onClick={() => handleDelete(song)}>
                        <Delete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showModal && (
            <Modal
              isOpen={showModal}
              onAfterOpen={openModal}
              onRequestClose={closeModal}
              style={customStyles}
            >
              <div className="flex justify-between mb-3">
                <h2 className="font-bold">Add Song</h2>
                <button onClick={closeModal}>close</button>
              </div>
              <form>
                <div className="flex flex-col gap-2">
                  <h1 className="font-semibold">Song Name</h1>
                  <input
                    className="w-full border border-slate-500"
                    placeholder="enter song name"
                    value={newSongData.songName}
                    onChange={(e) =>
                      setNewSongData({
                        ...newSongData,
                        songName: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <h1 className="font-semibold">Song URL</h1>
                  <input
                    className="w-full border border-slate-500"
                    placeholder="enter song URL"
                    value={newSongData.songUrl}
                    onChange={(e) =>
                      setNewSongData({
                        ...newSongData,
                        songUrl: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <h1 className="font-semibold">Song Source</h1>
                  <input
                    className="w-full border border-slate-500"
                    placeholder="enter song source"
                    value={newSongData.sourceName}
                    onChange={(e) =>
                      setNewSongData({
                        ...newSongData,
                        sourceName: e.target.value,
                      })
                    }
                  />
                </div>

                <button className="flex gap-2 text-xs font-bold items-center border border-current p-1 mt-2">
                  <Download />
                  <h1>Click to Upload Profile Thumbnail</h1>
                </button>

                <p className="text-xs my-4">
                  image should be aspect ratio of 1:1 with a size of 3000 pixels
                  x 3000 pixels
                </p>

                <div className="flex flex-end text-end gap-2">
                  <button className="border border-slate-500 px-3">
                    Cancel
                  </button>
                  <button
                    className="bg-[blue] text-[white] px-3"
                    onClick={() => addNewSong(newSongData)}
                  >
                    Add
                  </button>
                </div>
              </form>
            </Modal>
          )}
        </div>
        <Draggable axis="y">
          <div
            className="flex fixed right-0 bottom-0 w-full bg-gray-200 p-4"
            style={{
              width: "calc(100% - 256px)",
              justifyContent: "end",
              alignItems: "end",
            }}
          >
            <button className="p-3" onClick={handlePrevious}>
              <Previous />
            </button>
            <audio
              className="w-full h-12"
              id="audioPlayer"
              controls
              ref={audioRef}
            ></audio>

            <button className="p-3" onClick={handleNext}>
              <Next />
            </button>
          </div>
        </Draggable>
      </div>
    </>
  );
};
