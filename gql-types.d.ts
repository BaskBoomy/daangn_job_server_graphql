import { ObjectId } from "mongoose";

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: ObjectId;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Apply = {
  __typename?: 'Apply';
  _id: Scalars['ID'];
  createdAt: Scalars['String'];
  job: Job;
  updatedAt: Scalars['String'];
  user: User;
};

export type AuthData = {
  __typename?: 'AuthData';
  token: Scalars['String'];
  userId: Scalars['String'];
};

export type Coordinate = {
  x: Scalars['String'];
  y: Scalars['String'];
};

export type Job = {
  __typename?: 'Job';
  _id: Scalars['ID'];
  date: Scalars['String'];
  detailcontent: Scalars['String'];
  images: Array<Scalars['String']>;
  isShortJob: Scalars['Boolean'];
  isUserLike?: Maybe<Scalars['Boolean']>;
  jobOfferer: any;
  pay: Scalars['String'];
  place: Scalars['String'];
  salary: Scalars['String'];
  title: Scalars['String'];
  updatedFromUser: Scalars['Boolean'];
  workCategory: Array<Scalars['String']>;
  workTime?: Maybe<Scalars['String']>;
};

export type JobInput = {
  date: Scalars['String'];
  detailcontent: Scalars['String'];
  images: Array<Scalars['String']>;
  isShortJob: Scalars['Boolean'];
  pay: Scalars['String'];
  place: Scalars['String'];
  salary: Scalars['String'];
  title: Scalars['String'];
  updatedFromUser: Scalars['Boolean'];
  workCategory: Array<Scalars['String']>;
  workTime: Scalars['String'];
};

export type Like = {
  __typename?: 'Like';
  _id: Scalars['ID'];
  createdAt: Scalars['String'];
  job: Job;
  updatedAt: Scalars['String'];
  user: User;
};

export type Location = {
  __typename?: 'Location';
  X?: Maybe<Scalars['String']>;
  Y?: Maybe<Scalars['String']>;
  address?: Maybe<Scalars['String']>;
  currentX?: Maybe<Scalars['Float']>;
  currentY?: Maybe<Scalars['Float']>;
  directDistance?: Maybe<Scalars['Float']>;
};

export type Result = {
  __typename?: 'Result';
  code: Scalars['Int'];
  message: Scalars['String'];
};

export type RootMutation = {
  __typename?: 'RootMutation';
  applyJob: Apply;
  cancelApply: Job;
  createJob?: Maybe<Job>;
  createUser?: Maybe<User>;
  deleteJob: Job;
  likeJob: Like;
  sendSMSCode: Result;
  unLikeJob: Job;
  updateUser: User;
  verifySMSCode: Result;
};


export type RootMutationApplyJobArgs = {
  jobId: Scalars['ID'];
};


export type RootMutationCancelApplyArgs = {
  applyId: Scalars['ID'];
};


export type RootMutationCreateJobArgs = {
  jobInput?: InputMaybe<JobInput>;
};


export type RootMutationCreateUserArgs = {
  userInput?: InputMaybe<UserInput>;
};


export type RootMutationDeleteJobArgs = {
  jobId?: InputMaybe<Scalars['String']>;
};


export type RootMutationLikeJobArgs = {
  jobId: Scalars['ID'];
};


export type RootMutationSendSmsCodeArgs = {
  phoneNumber: Scalars['String'];
};


export type RootMutationUnLikeJobArgs = {
  jobId: Scalars['ID'];
};


export type RootMutationUpdateUserArgs = {
  userInput?: InputMaybe<UserUpdateInput>;
};


export type RootMutationVerifySmsCodeArgs = {
  code: Scalars['String'];
  phoneNumber: Scalars['String'];
};

export type RootQuery = {
  __typename?: 'RootQuery';
  applys: Array<Apply>;
  getNearAddress: Array<Maybe<Location>>;
  job: Job;
  jobs: Array<Job>;
  login?: Maybe<AuthData>;
  me: User;
  searchJob: Array<Maybe<Job>>;
  searchLocation: Array<Maybe<Location>>;
  user: User;
};


export type RootQueryGetNearAddressArgs = {
  coordinate: Coordinate;
};


export type RootQueryJobArgs = {
  jobId: Scalars['String'];
};


export type RootQueryLoginArgs = {
  phoneNumber: Scalars['String'];
};


export type RootQuerySearchJobArgs = {
  searchType?: InputMaybe<SearchCategory>;
};


export type RootQuerySearchLocationArgs = {
  searchText: Scalars['String'];
};


export type RootQueryUserArgs = {
  userId: Scalars['String'];
};

export type SearchCategory = {
  dates?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  isShortJob?: InputMaybe<Scalars['Boolean']>;
  place?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  text?: InputMaybe<Scalars['String']>;
  time?: InputMaybe<TimeSpan>;
  workCategory?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type TimeSpan = {
  endTime?: InputMaybe<Scalars['String']>;
  startTime?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ID'];
  appliedJobs: Array<Job>;
  borndate?: Maybe<Scalars['String']>;
  careers?: Maybe<Array<Maybe<Scalars['String']>>>;
  createdJobs: Array<Job>;
  gender?: Maybe<Scalars['String']>;
  likedJobs: Array<Job>;
  name?: Maybe<Scalars['String']>;
  nickname: Scalars['String'];
  phoneNumber: Scalars['String'];
  selfIntroduction?: Maybe<Scalars['String']>;
};

export type UserInput = {
  nickname: Scalars['String'];
  phoneNumber: Scalars['String'];
};

export type UserUpdateInput = {
  borndate?: InputMaybe<Scalars['String']>;
  careers?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  gender?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  nickname?: InputMaybe<Scalars['String']>;
  phoneNumber?: InputMaybe<Scalars['String']>;
  selfIntroduction?: InputMaybe<Scalars['String']>;
};
