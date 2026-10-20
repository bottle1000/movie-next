'use server';

import { redirect } from 'next/navigation';
import { updateMovieById, deleteMovieById, createMovie, findMovieById } from '@/lib/repo/movie/movieRepo';
import { getCurrentUser } from '@/lib/auth/auth';
import path from 'path';
import { mkdir, writeFile } from 'fs/promises';
import { revalidatePath } from 'next/cache';

async function saveLocalImage(file) {
    const mime = file.type;
    const ext = mime === 'image/png' ? 'png' : mime === 'image/jpeg' ? 'jpeg' : 'webp';
    const filename = `${crypto.randomUUID()}.${ext}`;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), buffer);

    // 브라우저 접근 경로
    return `/uploads/${filename}`;
}

export async function createMovieAction(prevState, formData) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return { ok: false, message: '로그인이 필요합니다.' };
        }

        const isAdmin = user.role.toUpperCase() === 'ADMIN';
        if (!isAdmin) {
            return { ok: false, message: '어드민 권한이 필요합니다.' };
        }

        const title = formData.get('title')?.toString();
        const director = formData.get('director')?.toString();
        const story = formData.get('story')?.toString();
        const year = formData.get('year');
        const file = formData.get('thumbnailFile');

        const fieldErrors = {};
        if (!title) {
            fieldErrors.title = '제목을 입력해 주세요.';
        }

        if (!director) {
            fieldErrors.director = '감독명을 입력해 주세요.';
        }

        if (!story) {
            fieldErrors.story = '줄거리를 입력해 주세요.';
        }

        if (!year) {
            fieldErrors.year = '개봉 연도를 입력해 주세요.';
        }

        if (!file) {
            fieldErrors.thumbnail = '썸네일 이미지를 선택해주세요.';
        }

        if (Object.keys(fieldErrors).length > 0) {
            return {
                ok: false,
                message: '입력값을 다시 확인해주세요.',
                fieldErrors,
                fields: { title, director, story, year },
            };
        }

        const thumbnail = await saveLocalImage(file);

        await createMovie({ title, director, year, thumbnail, story, user_id: user.user_id });
    } catch (err) {
        console.error('[createMovieAction]', err);
        return { ok: false, message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.', fieldErrors: {} };
    }
    redirect('/movies');
}

export async function updateMovieAction(prevState, formData) {
    try {
        const id = Number(formData.get('id'));
        const user = await getCurrentUser();
        if (!user) {
            return { ok: false, message: '로그인이 필요합니다.' };
        }

        const isAdmin = user.role.toUpperCase() === 'ADMIN';
        if (!isAdmin) {
            return { ok: false, message: '어드민 권한이 필요합니다.' };
        }

        const exist = await findMovieById(id);
        if (!exist) {
            return { ok: false, message: '존재하지 않는 영화 정보입니다.' };
        }

        const title = formData.get('title')?.toString();
        const director = formData.get('director')?.toString();
        const story = formData.get('story')?.toString();
        const year = formData.get('year');
        const file = formData.get('thumbnailFile'); // input name에 등록해놓은 thumbnailFile 키로 파일을 꺼낸다.

        const fieldErrors = {};

        if (!title) {
            fieldErrors.title = '제목을 입력해 주세요.';
        }

        if (!director) {
            fieldErrors.director = '감독명을 입력해 주세요.';
        }

        if (!story) {
            fieldErrors.story = '줄거리를 입력해 주세요.';
        }

        if (!year) {
            fieldErrors.year = '개봉 연도를 입력해 주세요.';
        }

        if (!file) {
            fieldErrors.thumbnail = '썸네일 이미지를 선택해주세요.';
        }

        if (Object.keys(fieldErrors).length > 0) {
            return {
                ok: false,
                message: '입력값을 확인해주세요',
                fieldErrors,
            };
        }

        let thumbnail = exist.thumbnail;

        if (file && file.size > 0) {
            thumbnail = await saveLocalImage(file);
        }

        const payload = {
            title: title,
            director: director,
            story: story,
            year: year,
            thumbnail: thumbnail,
        };

        await updateMovieById(id, payload);
    } catch (err) {
        console.error('[updateMovieAction]', err);
        return { ok: false, message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' };
    }

    redirect('/movies');
}

export async function deleteMovieAction(prevState, formData) {
    try {
        const id = Number(formData.get('id'));
        const user = await getCurrentUser();

        if (!user) {
            return { ok: false, message: '로그인이 필요합니다.' };
        }

        const isAdmin = user.role.toUpperCase() === 'ADMIN';
        if (!isAdmin) {
            return { ok: false, message: '어드민 권한이 필요합니다.' };
        }

        const exist = await findMovieById(id);
        if (!exist) {
            return { ok: false, message: '존재하지 않는 영화 정보입니다.' };
        }

        await deleteMovieById(id);
    } catch (err) {
        console.error('[deleteMovieAction]', err);
        return { ok: false, message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' };
    }

    redirect('/movies');
}

export async function searchMoviesAction(prevState, formData) {
    //사용자가 input에 '기생충'이라고 작성하면 formData.get('query')는 기생충이 들어옴.
    const query = formData.get('query')?.toString().trim();

    // /movies/search?query=기생충 으로 페이지 이동
    redirect(`/movies/search?query=${encodeURIComponent(query)}`);
}
