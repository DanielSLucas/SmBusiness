import { Tag } from '../../tags/entities/tag.entity';
import { Replace } from '../../../shared/helpers/Replace';

export enum MovementType {
  INCOME = 'INCOME',
  OUTCOME = 'OUTCOME',
}

interface MovementProps {
  date: Date;
  description: string;
  amount: number;
  type: MovementType;
  authUserId: string;
  tags: Tag[];
  refId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Movement {
  private _id: number;
  private props: MovementProps;

  constructor(
    props: Replace<
      MovementProps,
      {
        createdAt?: Date;
        updatedAt?: Date;
      }
    >,
    id?: number,
  ) {
    this._id = id ?? Math.random() * 100;
    this.props = {
      ...props,
      date: new Date(props.date),
      type:
        props.type.toUpperCase() === MovementType.INCOME
          ? MovementType.INCOME
          : MovementType.OUTCOME,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };
  }

  public get id() {
    return this._id;
  }

  public set date(date: Date) {
    this.props.date = new Date(date);
  }

  public get date() {
    return this.props.date;
  }

  public set description(description: string) {
    this.props.description = description;
  }

  public get description() {
    return this.props.description;
  }

  public set amount(amount: number) {
    this.props.amount = amount;
  }

  public get amount() {
    return this.props.amount;
  }

  public set type(type: MovementType) {
    this.props.type =
      type.toUpperCase() === MovementType.INCOME
        ? MovementType.INCOME
        : MovementType.OUTCOME;
  }

  public get type() {
    return this.props.type;
  }

  public set authUserId(authUserId: string) {
    this.props.authUserId = authUserId;
  }

  public get authUserId() {
    return this.props.authUserId;
  }

  public set tags(tags: Tag[]) {
    this.props.tags = tags;
  }

  public get tags() {
    return this.props.tags;
  }

  public set refId(refId: string) {
    this.props.refId = refId;
  }

  public get refId() {
    return this.props.refId;
  }

  public get createdAt() {
    return this.props.createdAt;
  }

  public get updatedAt() {
    return this.props.createdAt;
  }
}
