// services/media-service/src/routes/media.routes.ts
import { Router } from 'express';
import { createMedia, listMedia, getMedia, updateMedia, deleteMedia, patchRating, getExternal, refreshExternal } from '../controllers/media.controller';
const router = Router();

router.post('/', createMedia);
router.get('/', listMedia);
router.get('/:id', getMedia);
router.put('/:id', updateMedia);
router.delete('/:id', deleteMedia);
router.patch('/:id/rating', patchRating);
// External metadata
router.get('/:id/external', getExternal);
router.post('/:id/external/refresh', refreshExternal);

export default router;
