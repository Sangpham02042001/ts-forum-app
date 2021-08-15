import Thread from './Thread'

export default class ThreadItem {
  constructor(
    public id: string,
    public views: number,
    public points: number,
    public userName: string,
    public userId: string,
    public threadId: string,
    public body: string,
    public createdOn: Date
  ) { }
}