// services/media-service/src/services/external-metadata.service.ts
import axios from 'axios';

const OMDB_KEY = process.env.OMDB_API_KEY;
const TMDB_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE = 'https://api.themoviedb.org/3';
const OMDB_BASE = 'http://www.omdbapi.com/';

export async function fetchFromOmdbByTitle(title: string, year?: string) {
  if (!OMDB_KEY) return { error: 'OMDb API key not configured' };
  const params: any = { apikey: OMDB_KEY, t: title };
  if (year) params.y = year;
  const res = await axios.get(OMDB_BASE, { params });
  return res.data;
}

export async function fetchFromTmdbByTitle(title: string, year?: string) {
  if (!TMDB_KEY) return { error: 'TMDB API key not configured' };
  const params: any = { api_key: TMDB_KEY, query: title };
  if (year) params.year = year;
  const search = await axios.get(`${TMDB_BASE}/search/movie`, { params });
  const results = search.data.results || [];
  if (results.length === 0) return { error: 'Not found' };
  const movie = results[0];
  const details = await axios.get(`${TMDB_BASE}/movie/${movie.id}`, { params: { api_key: TMDB_KEY } });
  return details.data;
}

export async function aggregateExternalData(title: string, year?: string) {
  const out: any = { sources: [] };
  const omdb = await (fetchFromOmdbByTitle(title, year).catch((e)=> ({ error: String(e) })));
  out.sources.push({ provider: 'omdb', result: omdb });
  const tmdb = await (fetchFromTmdbByTitle(title, year).catch((e)=> ({ error: String(e) })));
  out.sources.push({ provider: 'tmdb', result: tmdb });
  return out;
}
