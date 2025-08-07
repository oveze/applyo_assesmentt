"use client";

import { useState, useEffect, useCallback } from "react";
import SearchBar from "./components/SearchBar";
import Filters from "./components/Filters";
import MovieCard from "./components/MovieCard";
import Pagination from "./components/Pagination";
import MovieDetailsModal from './components/MovieDetailsModal';

const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;

// Debug logging
console.log("Environment variables check:");
console.log("NEXT_PUBLIC_OMDB_API_KEY:", process.env.NEXT_PUBLIC_OMDB_API_KEY);
console.log("API_KEY variable:", API_KEY);
console.log("All NEXT_PUBLIC env vars:", Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC')));

// Type definitions
interface MovieSearchResult {
  imdbID: string;
  Title: string;
  Year: string;
  Type: "movie" | "series" | "episode";
  Poster: string;
}

// Alias for backward compatibility
type Movie = MovieSearchResult;

interface SearchResponse {
  Search?: MovieSearchResult[];
  totalResults?: string;
  Response: string;
  Error?: string;
}

interface MovieDetails {
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
}

interface FetchMoviesQuery {
  s: string;
  type?: string;
  y?: string;
  page?: number;
}

const fetchMovies = async (query: FetchMoviesQuery): Promise<SearchResponse> => {
  if (!API_KEY) {
    throw new Error("OMDB API key is not configured. Please check your environment variables.");
  }
  
  const {s, type, y, page} = query;
  const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(s)}&page=${page ?? 1}${type ? `&type=${type}` : ''}${y ? `&y=${y}` : ''}`;
  
  const res = await fetch(url);
  
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  
  return res.json();
};

const fetchMovieDetails = async (imdbID: string): Promise<MovieDetails> => {
  if (!API_KEY) {
    throw new Error("OMDB API key is not configured. Please check your environment variables.");
  }
  
  const url = `https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}&plot=full`;
  const res = await fetch(url);
  
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  
  return res.json();
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
    <p className="text-gray-600 dark:text-gray-400">Searching movies...</p>
  </div>
);

// Empty State Component
const EmptyState = ({ hasSearched }: { hasSearched: boolean }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="text-6xl mb-4 opacity-50">🎬</div>
    {hasSearched ? (
      <>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          No movies found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          Try adjusting your search terms or filters to find what you&apos;re looking for.
        </p>
      </>
    ) : (
      <>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Welcome to Movie Explorer
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          Search for your favorite movies and TV series to get started.
        </p>
      </>
    )}
  </div>
);

// Modal Loading Component
const ModalLoading = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-blue-900/90 backdrop-blur-sm" />
    <div className="relative bg-gradient-to-br from-slate-800 to-blue-900 rounded-2xl shadow-2xl p-8 border border-blue-700">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
        <p className="text-white">Loading movie details...</p>
      </div>
    </div>
  </div>
);

export default function Home() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [year, setYear] = useState("");
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState<MovieSearchResult[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [modalData, setModalData] = useState<MovieDetails | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const searchMovies = useCallback(async () => {
    if (!search.trim()) return;
    if (!API_KEY) {
      return;
    }
    
    setLoading(true);
    setHasSearched(true);
    
    try {
      const data = await fetchMovies({s: search, type, y: year, page});
      if (data.Response === "False") {
        setMovies([]);
        setTotalPages(1);
        // Just don't show anything for "Too many results" - silently handle it
        if (data.Error !== "Too many results.") {
          // Only show other types of errors if needed, but for now just return
        }
      } else {
        setMovies(data.Search || []);
        setTotalPages(Math.ceil(+(data.totalResults || 0) / 10));
      }
    } catch (err) {
      console.error("Search error:", err);
      // Don't show network errors either - just silently fail
      setMovies([]);
    }
    setLoading(false);
  }, [search, type, year, page]);

  useEffect(() => { 
    if (search.trim() && API_KEY) {
      searchMovies(); 
    }
  }, [page, searchMovies]);

  const handleSearch = () => { 
    setPage(1); 
    searchMovies(); 
  };
  
  const handlePage = (p: number) => setPage(p);

  const openDetails = async (movie: MovieSearchResult) => {
    if (!API_KEY) {
      return;
    }
    
    setSelected(movie.imdbID);
    setModalData(null);
    setDetailsLoading(true);
    
    try {
      const details = await fetchMovieDetails(movie.imdbID);
      setModalData(details);
    } catch (err) {
      console.error("Details fetch error:", err);
      setSelected(null);
    }
    setDetailsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="max-w-3xl mx-auto p-4 flex-grow">
        <h1 className="text-3xl font-bold mb-3">Movie & Series Explorer</h1>
        <SearchBar value={search} onChange={setSearch} onSearch={handleSearch} />
        <Filters type={type} year={year} setType={setType} setYear={setYear} />
        
        {/* Loading State */}
        {loading && <LoadingSpinner />}
        
        {/* Content Area */}
        {!loading && (
          <>
            {movies.length === 0 ? (
              <EmptyState hasSearched={hasSearched} />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {movies.map(movie => (
                  <MovieCard key={movie.imdbID} movie={movie} onClick={() => openDetails(movie)} />
                ))}
              </div>
            )}
          </>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <Pagination current={page} total={totalPages} onPage={handlePage} />
        )}
      </main>
      
      {/* Footer Credit */}
      <footer className="mt-8 py-4 border-t border-gray-300 dark:border-gray-700 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Built with ❤️ by <span className="text-blue-500 dark:text-blue-400 font-medium">Mohammed oveze<br/> ovezeov@gmail.com</span>
        </p>
      </footer>
      
      {/* Modal Loading */}
      {selected && detailsLoading && <ModalLoading />}
      
      {/* Modal Content */}
      {selected && modalData && !detailsLoading && (
        <MovieDetailsModal movie={modalData} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
