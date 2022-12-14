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

export type Job = {
  __typename?: 'Job';
  _id: Scalars['ID'];
  date: Scalars['String'];
  detailcontent: Scalars['String'];
  images: Array<Scalars['String']>;
  isShortJob: Scalars['Boolean'];
  jobOfferer: any;
  pay: Scalars['String'];
  place: Scalars['String'];
  salary: Scalars['String'];
  time: Scalars['String'];
  title: Scalars['String'];
  updatedFromUser: Scalars['Boolean'];
  workCategory: Array<Scalars['String']>;
};

export type JobInput = {
  date: Scalars['String'];
  detailcontent: Scalars['String'];
  images: Array<Scalars['String']>;
  isShortJob: Scalars['Boolean'];
  pay: Scalars['String'];
  place: Scalars['String'];
  salary: Scalars['String'];
  time: Scalars['String'];
  title: Scalars['String'];
  updatedFromUser: Scalars['Boolean'];
  workCategory: Array<Scalars['String']>;
};

export type Like = {
  __typename?: 'Like';
  _id: Scalars['ID'];
  createdAt: Scalars['String'];
  job: Job;
  updatedAt: Scalars['String'];
  user: User;
};

export type RootMutation = {
  __typename?: 'RootMutation';
  applyJob: Apply;
  cancelApply: Job;
  createJob?: Maybe<Job>;
  createUser?: Maybe<User>;
  deleteJob: Job;
  likeJob: Like;
  unLikeJob: Job;
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


export type RootMutationUnLikeJobArgs = {
  jobId: Scalars['ID'];
};

export type RootQuery = {
  __typename?: 'RootQuery';
  applys: Array<Apply>;
  jobs: Array<Job>;
  login?: Maybe<AuthData>;
  me: User;
  user: User;
};


export type RootQueryLoginArgs = {
  phoneNumber: Scalars['String'];
};


export type RootQueryUserArgs = {
  userId: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ID'];
  borndate?: Maybe<Scalars['String']>;
  careers?: Maybe<Array<Maybe<Scalars['String']>>>;
  createdJobs: Array<Job>;
  gender?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  nickname: Scalars['String'];
  phoneNumber: Scalars['String'];
  selfIntroduction?: Maybe<Scalars['String']>;
};

export type UserInput = {
  nickname: Scalars['String'];
  phoneNumber: Scalars['String'];
};
