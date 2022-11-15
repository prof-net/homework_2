import {Response, Router} from "express";
import {RequestWithParams, RequestWithParamsBody} from "../types/types";
import {IComment, ICommentBody} from "../types/typesComments";
import {commentsQueryRepository} from "../repositories/comments/comments-query-repository";
import {commentsService} from "../domain/comments-service";
import {body} from "express-validator";

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
        res.status(404).send(result);
    }
});

//change single comment
commentsRouter.put('/comments/:id',
    contentLengthValidation,
    async (req: RequestWithParamsBody<{ id: string }, ICommentBody>, res: Response) => {
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
    async (req: RequestWithParams<{ id: string }>, res: Response) => {
        const result = await commentsService.deleteComment(req.params.id);
        if (result) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    })
