// pending users can't access data
export function noPendingUsers() {
  return (req: any, res: any, next: any) => {
    const userStatus = req.user.status;
    // req.user;
    if (userStatus != 'Approved') {
      res.sendStatus(401);
      return;
    } else {
      res.sendResponse = res.send;
      res.send = (body: any) => {
        res.sendResponse(body);
      };
      next();
    }
  };
}
