import {Response, Router} from "express";
import {RequestWithParams, RequestWithParamsBody} from "../types/types";
import {IComment, ICommentBody} from "../types/typesComments";
import {commentsQueryRepository} from "../repositories/comments/comments-query-repository";
import {commentsService} from "../domain/comments-service";
import {body} from "express-validator";
import {bearerAuthMiddleware} from "../middlewares/bearer-auth-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";

export const commentsRouter = Router({});

export const contentLengthValidation = body('content').exists().trim().isLength({
    min: 20,
    max: 300
}).withMessage("Content should be more 20 less 300 symbols");

//get single comment
commentsRouter.get('/comments/:id', async (req: RequestWithParams<{ id: string }>, res: Response<IComment | null>) => {
    const result = await commentsQueryRepository.getSingleComment(req.params.id);
    if (result) {
        res.status(200).send(result);
    } else {
        res.sendStatus(404);
    }
});

//change single comment
commentsRouter.put('/comments/:id',
    bearerAuthMiddleware,
    contentLengthValidation,
    inputValidationMiddleware,
    async (req: RequestWithParamsBody<{ id: string }, ICommentBody>, res: Response) => {

        const comment = await commentsQueryRepository.getSingleComment(req.params.id);
        if (req.user!.id !== comment?.userId) {
            res.sendStatus(403);
            return;
        }

        const result = await commentsService.changeComment(
            req.params.id,
            req.body.content,
        );
        if (result) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    });

//delete single post
commentsRouter.delete('/comments/:id',
    bearerAuthMiddleware,
    async (req: RequestWithParams<{ id: string }>, res: Response) => {
        const comment = await commentsQueryRepository.getSingleComment(req.params.id);
        if (comment && req.user!.id !== comment?.userId) {
            res.sendStatus(403);
            return;
        }
        const result = await commentsService.deleteComment(req.params.id);
        if (result) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    })
