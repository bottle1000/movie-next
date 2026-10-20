import { prisma } from '../prisma';

export async function findAllMovies() {
    const rows = await prisma.movie.findMany({
        orderBy: [{ movie_id: 'desc' }],
    });

    return rows;
}

export async function findMovieById(id) {
    const rows = await prisma.movie.findUnique({
        where: { movie_id: Number(id) },
    });

    return rows;
}

export async function findMovieByKeyword(keyword) {
    const rows = await prisma.movie.findMany({
        where: {
            title: { contains: keyword },
        },
        select: {
            movie_id: true,
            title: true,
            director: true,
            year: true,
            thumbnail: true,
        },
        orderBy: [{ year: 'desc' }, { movie_id: 'desc' }],
    });
    return rows;
}

export async function createMovie({ title, director, year, thumbnail, story, user_id }) {
    await prisma.movie.create({
        data: {
            title,
            director,
            year: Number(year),
            thumbnail: thumbnail,
            story: story,
            users: { connect: { user_id: user_id } },
        },
    });
}

export async function updateMovieById(id, data) {
    const payload = {};
    payload.title = data.title;
    payload.director = data.director;
    payload.year = Number(data.year);
    payload.thumbnail = data.thumbnail;
    payload.story = data.story;

    try {
        const updated = await prisma.movie.update({
            where: { movie_id: Number(id) },
            data: payload,
        });
        return updated;
    } catch (err) {
        console.error('업데이트 실패', err);
        return null;
    }
}

export async function deleteMovieById(id) {
    await prisma.movie.delete({
        where: { movie_id: Number(id) },
    });
}

export async function countMovies() {
    return prisma.movie.count();
}

export async function findMoviesByPage({ page = 1, size = 10 } = {}) {
    const take = Number(size) || 12;
    const skip = (page - 1) * size;

    return prisma.movie.findMany({
        skip,
        take,
        orderBy: {
            movie_id: 'desc',
        },
        select: {
            movie_id: true,
            title: true,
            year: true,
            director: true,
            thumbnail: true,
        },
    });
}

export async function findMoviesPage({ page = 1, size = 12 } = {}) {
    const take = Number(size) || 12;
    const skip = (page - 1) * size;

    const [total, items] = await Promise.all([countMovies(), findMoviesByPage(take, skip)]);

    return { total, items, page, size };
}
