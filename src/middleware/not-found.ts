const notFound = (req: any, res: any, next: any) => {
  const error: any = new Error("Not Found");
  error.status = 404;
  next(error);
};

export default notFound;
