import React from "react";
import Image from "next/image";

type MovieDetailsModalProps = {
  movie: {
    Title: string;
    Year: string;
    Rated: string;
    Released: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Language: string;
    Country: string;
    Awards: string;
    Poster: string;
    Ratings: Array<{ Source: string; Value: string }>;
    Metascore: string;
    imdbRating: string;
    imdbVotes: string;
    imdbID: string;
    Type: string;
    DVD: string;
    BoxOffice: string;
    Production: string;
    Website: string;
    Response: string;
  };
  onClose: () => void;
};

const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({ movie, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
      >
        ✕
      </button>

      {/* Header with poster and basic info */}
      <div className="flex flex-col md:flex-row gap-6 p-6">
        <div className="flex-shrink-0">
          {movie.Poster && movie.Poster !== "N/A" ? (
            <div className="relative w-64 h-96 mx-auto md:mx-0">
              <Image
                src={movie.Poster}
                alt={movie.Title}
                fill
                className="object-cover rounded-lg shadow-lg"
                sizes="256px"
              />
            </div>
          ) : (
            <div className="w-64 h-96 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <div className="text-6xl opacity-50">🎬</div>
            </div>
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            {movie.Title}
          </h1>
          
          <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
            <span>{movie.Year}</span>
            <span>•</span>
            <span>{movie.Rated}</span>
            <span>•</span>
            <span>{movie.Runtime}</span>
            <span>•</span>
            <span className="capitalize">{movie.Type}</span>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Genre</p>
            <p className="text-gray-900 dark:text-white">{movie.Genre}</p>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Plot</p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {movie.Plot}
            </p>
          </div>

          {/* Ratings */}
          <div className="mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Ratings</p>
            <div className="flex flex-wrap gap-4">
              {movie.imdbRating && movie.imdbRating !== "N/A" && (
                <div className="bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                    IMDb: {movie.imdbRating}/10
                  </span>
                </div>
              )}
              {movie.Metascore && movie.Metascore !== "N/A" && (
                <div className="bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-green-800 dark:text-green-300">
                    Metacritic: {movie.Metascore}/100
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="px-6 pb-8 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Director</p>
            <p className="text-gray-900 dark:text-white">{movie.Director}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Writer</p>
            <p className="text-gray-900 dark:text-white">{movie.Writer}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Cast</p>
          <p className="text-gray-900 dark:text-white">{movie.Actors}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Released</p>
            <p className="text-gray-900 dark:text-white font-medium">{movie.Released}</p>
          </div>
          {movie.BoxOffice && movie.BoxOffice !== "N/A" && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Box Office</p>
              <p className="text-gray-900 dark:text-white font-medium">{movie.BoxOffice}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Language</p>
            <p className="text-gray-900 dark:text-white">{movie.Language}</p>
          </div>
        </div>

        {movie.Awards && movie.Awards !== "N/A" && (
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border-l-4 border-amber-400">
            <p className="text-sm text-amber-700 dark:text-amber-300 mb-1 font-medium">Awards</p>
            <p className="text-amber-800 dark:text-amber-200">{movie.Awards}</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default MovieDetailsModal;
