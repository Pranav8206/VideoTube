// import React from "react";
// import { Link } from "react-router-dom";

// {/* <VideoCard video={video} />
// const video = {
//   _id: "123",
//   thumbnail: "https://i.ytimg.com/vi/abcd1234/maxresdefault.jpg",
//   title: "Learn MERN Stack in 30 Minutes",
//   channelName: "CodeWithPM",
//   channelAvatar: "https://randomuser.me/api/portraits/men/45.jpg",
//   views: "1.2M",
//   createdAt: "2 days ago",
// }; */}





// // VideoCard Component
// const VideoCard = ({ video }) => {
//   return (
//     <div className="w-full sm:w-72 md:w-80 lg:w-72 cursor-pointer">
//       {/* Thumbnail */}
//       <Link to={`/watch/${video._id}`}>
//         <img
//           src={video.thumbnail}
//           alt={video.title}
//           className="w-full h-44 object-cover rounded-xl"
//         />
//       </Link>

//       {/* Video Info */}
//       <div className="flex mt-3 gap-3">
//         {/* Channel Avatar */}
//         <img
//           src={video.channelAvatar}
//           alt={video.channelName}
//           className="w-10 h-10 rounded-full object-cover"
//         />

//         {/* Text Section */}
//         <div className="flex flex-col overflow-hidden">
//           <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
//             {video.title}
//           </h3>
//           <p className="text-xs text-gray-600 mt-1">{video.channelName}</p>
//           <p className="text-xs text-gray-500">
//             {video.views} views • {video.createdAt}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VideoCard;
