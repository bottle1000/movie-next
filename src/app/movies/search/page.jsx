// src/app/movies/search/page.jsx
import { findMovieByKeyword } from '@/lib/repo/movie/movieRepo';
import MovieSearch from '@/components/movies/MovieSearch';

export default async function MovieSearchPage({ searchParams }) {
    // 예를 들어, movies/search?query=기생충 이라고 하면, serachParams : ?query=기생충
    const searchParam = await searchParams;
    const searchQuery = (searchParam?.query ?? '').toString().trim();
    console.log('searchQuery : ' + searchQuery);
    const items = await findMovieByKeyword(searchQuery);

    return <MovieSearch query={searchQuery} items={items} />;
}
