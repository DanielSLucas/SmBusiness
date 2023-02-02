import { randomUUID } from 'node:crypto';

import { Replace } from '../../../shared/helpers/Replace';

interface TagProps {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Tag {
  private _id: string;
  private props: TagProps;

  constructor(
    props: Replace<
      TagProps,
      {
        createdAt?: Date;
        updatedAt?: Date;
      }
    >,
    id?: string,
  ) {
    this._id = id ?? randomUUID();
    this.props = {
      name: props.name.toUpperCase(),
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };
  }

  public get id() {
    return this._id;
  }

  public set name(name: string) {
    this.props.name = name.toUpperCase();
  }

  public get name() {
    return this.props.name;
  }

  public get createdAt() {
    return this.props.createdAt;
  }

  public get updatedAt() {
    return this.props.createdAt;
  }
}
