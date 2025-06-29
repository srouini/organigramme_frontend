
type GithubIssueItem = {
    url: string;
    id: number;
    number: number;
    title: string;
    labels: {
      name: string;
      color: string;
    }[];
    state: string;
    comments: number;
    created_at: string;
    updated_at: string;
    closed_at?: string;
  };

  const dummyData: GithubIssueItem[] = [
    {
      url: "https://github.com/example/repo/issues/1",
      id: 1,
      number: 1,
      title: "Example Issue 1",
      labels: [{ name: "bug", color: "#ff0000" }],
      state: "open",
      comments: 3,
      created_at: "2024-05-01T12:00:00Z",
      updated_at: "2024-05-05T10:30:00Z",
      closed_at: ""
    },
    {
      url: "https://github.com/example/repo/issues/2",
      id: 2,
      number: 2,
      title: "Example Issue 2",
      labels: [{ name: "feature", color: "#00ff00" }],
      state: "closed",
      comments: 2,
      created_at: "2024-05-02T09:30:00Z",
      updated_at: "2024-05-04T15:45:00Z",
      closed_at: "2024-05-04T15:45:00Z"
    },
    {
      url: "https://github.com/example/repo/issues/3",
      id: 3,
      number: 3,
      title: "Example Issue 3",
      labels: [{ name: "bug", color: "#ff0000" }, { name: "documentation", color: "#0000ff" }],
      state: "open",
      comments: 0,
      created_at: "2024-05-03T14:15:00Z",
      updated_at: "2024-05-03T14:15:00Z",
      closed_at: ""
    },
    {
      url: "https://github.com/example/repo/issues/4",
      id: 4,
      number: 4,
      title: "Example Issue 4",
      labels: [{ name: "enhancement", color: "#ffa500" }],
      state: "open",
      comments: 1,
      created_at: "2024-05-04T11:00:00Z",
      updated_at: "2024-05-05T09:30:00Z",
      closed_at: ""
    },
    {
      url: "https://github.com/example/repo/issues/5",
      id: 5,
      number: 5,
      title: "Example Issue 5",
      labels: [{ name: "bug", color: "#ff0000" }],
      state: "closed",
      comments: 0,
      created_at: "2024-05-05T16:45:00Z",
      updated_at: "2024-05-06T10:20:00Z",
      closed_at: "2024-05-06T10:20:00Z"
    },
    {
      url: "https://github.com/example/repo/issues/6",
      id: 6,
      number: 6,
      title: "Example Issue 6",
      labels: [{ name: "feature", color: "#00ff00" }],
      state: "open",
      comments: 2,
      created_at: "2024-05-06T08:30:00Z",
      updated_at: "2024-05-08T11:15:00Z",
      closed_at: ""
    },
    {
      url: "https://github.com/example/repo/issues/7",
      id: 7,
      number: 7,
      title: "Example Issue 7",
      labels: [{ name: "bug", color: "#ff0000" }],
      state: "open",
      comments: 0,
      created_at: "2024-05-07T13:20:00Z",
      updated_at: "2024-05-07T13:20:00Z",
      closed_at: ""
    },
    {
      url: "https://github.com/example/repo/issues/8",
      id: 8,
      number: 8,
      title: "Example Issue 8",
      labels: [{ name: "enhancement", color: "#ffa500" }],
      state: "closed",
      comments: 1,
      created_at: "2024-05-08T10:10:00Z",
      updated_at: "2024-05-09T08:00:00Z",
      closed_at: "2024-05-09T08:00:00Z"
    },
    {
      url: "https://github.com/example/repo/issues/9",
      id: 9,
      number: 9,
      title: "Example Issue 9",
      labels: [{ name: "bug", color: "#ff0000" }],
      state: "open",
      comments: 2,
      created_at: "2024-05-09T14:45:00Z",
      updated_at: "2024-05-10T11:30:00Z",
      closed_at: ""
    },
    {
      url: "https://github.com/example/repo/issues/10",
      id: 10,
      number: 10,
      title: "Example Issue 10",
      labels: [{ name: "feature", color: "#00ff00" }],
      state: "closed",
      comments: 0,
      created_at: "2024-05-10T09:20:00Z",
      updated_at: "2024-05-11T12:15:00Z",
      closed_at: "2024-05-11T12:15:00Z"
    },
    {
      url: "https://github.com/example/repo/issues/11",
      id: 11,
      number: 11,
      title: "Example Issue 11",
      labels: [{ name: "enhancement", color: "#ffa500" }],
      state: "open",
      comments: 1,
      created_at: "2024-05-11T08:00:00Z",
      updated_at: "2024-05-12T10:30:00Z",
      closed_at: ""
    },
    {
      url: "https://github.com/example/repo/issues/12",
      id: 12,
      number: 12,
      title: "Example Issue 12",
      labels: [{ name: "bug", color: "#ff0000" }],
      state: "open",
      comments: 0,
      created_at: "2024-05-12T14:30:00Z",
      updated_at: "2024-05-12T14:30:00Z",
      closed_at: ""
    },
    {
      url: "https://github.com/example/repo/issues/13",
      id: 13,
      number: 13,
      title: "Example Issue 13",
      labels: [{ name: "feature", color: "#00ff00" }],
      state: "closed",
      comments: 2,
      created_at: "2024-05-13T09:45:00Z",
      updated_at: "2024-05-14T11:20:00Z",
      closed_at: "2024-05-14T11:20:00Z"
    },
    {
      url: "https://github.com/example/repo/issues/14",
      id: 14,
      number: 14,
      title: "Example Issue 14",
      labels: [{ name: "enhancement", color: "#ffa500" }],
      state: "open",
      comments: 0,
      created_at: "2024-05-14T13:00:00Z",
      updated_at: "2024-05-14T13:00:00Z",
      closed_at: ""
    },
    {
      url: "https://github.com/example/repo/issues/15",
      id: 15,
      number: 15,
      title: "Example Issue 15",
      labels: [{ name: "bug", color: "#ff0000" }],
      state: "closed",
      comments: 1,
      created_at: "2024-05-15T11:30:00Z",
      updated_at: "2024-05-16T09:45:00Z",
      closed_at: "2024-05-16T09:45:00Z"
    },
    {
      url: "https://github.com/example/repo/issues/16",
      id: 16,
      number: 16,
      title: "Example Issue 16",
      labels: [{ name: "feature", color: "#00ff00" }],
      state: "open",
      comments: 3,
      created_at: "2024-05-16T08:20:00Z",
      updated_at: "2024-05-18T10:00:00Z",
      closed_at: ""
    },
    {
      url: "https://github.com/example/repo/issues/17",
      id: 17,
      number: 17,
      title: "Example Issue 17",
      labels: [{ name: "bug", color: "#ff0000" }],
      state: "open",
      comments: 0,
      created_at: "2024-05-17T15:15:00Z",
      updated_at: "2024-05-17T15:15:00Z",
      closed_at: ""
    },
    {
      url: "https://github.com/example/repo/issues/18",
      id: 18,
      number: 18,
      title: "Example Issue 18",
      labels: [{ name: "enhancement", color: "#ffa500" }],
      state: "closed",
      comments: 2,
      created_at: "2024-05-18T10:30:00Z",
      updated_at: "2024-05-19T09:00:00Z",
      closed_at: "2024-05-19T09:00:00Z"
    },
    {
      url: "https://github.com/example/repo/issues/19",
      id: 19,
      number: 19,
      title: "Example Issue 19",
      labels: [{ name: "bug", color: "#ff0000" }],
      state: "open",
      comments: 1,
      created_at: "2024-05-19T14:40:00Z",
      updated_at: "2024-05-20T12:30:00Z",
      closed_at: ""
    },
    {
      url: "https://github.com/example/repo/issues/20",
      id: 20,
      number: 20,
      title: "Example Issue 20",
      labels: [{ name: "feature", color: "#00ff00" }],
      state: "open",
      comments: 0,
      created_at: "2024-05-20T08:00:00Z",
      updated_at: "2024-05-20T08:00:00Z",
      closed_at: ""
    },
    {
      url: "https://github.com/example/repo/issues/10",
      id: 10,
      number: 10,
      title: "Example Issue 10",
      labels: [{ name: "feature", color: "#00ff00" }],
      state: "closed",
      comments: 0,
      created_at: "2024-05-10T09:20:00Z",
      updated_at: "2024-05-11T12:15:00Z",
      closed_at: "2024-05-11T12:15:00Z"
    },
    {
      url: "https://github.com/example/repo/issues/11",
      id: 11,
      number: 11,
      title: "Example Issue 11",
      labels: [{ name: "enhancement", color: "#ffa500" }],
      state: "open",
      comments: 1,
      created_at: "2024-05-11T08:00:00Z",
      updated_at: "2024-05-12T10:30:00Z",
      closed_at: ""
    },
    {
      url: "https://github.com/example/repo/issues/12",
      id: 12,
      number: 12,
      title: "Example Issue 12",
      labels: [{ name: "bug", color: "#ff0000" }],
      state: "open",
      comments: 0,
      created_at: "2024-05-12T14:30:00Z",
      updated_at: "2024-05-12T14:30:00Z",
      closed_at: ""
    },
    {
      url: "https://github.com/example/repo/issues/13",
      id: 13,
      number: 13,
      title: "Example Issue 13",
      labels: [{ name: "feature", color: "#00ff00" }],
      state: "closed",
      comments: 2,
      created_at: "2024-05-13T09:45:00Z",
      updated_at: "2024-05-14T11:20:00Z",
      closed_at: "2024-05-14T11:20:00Z"
    },
    {
      url: "https://github.com/example/repo/issues/14",
      id: 14,
      number: 14,
      title: "Example Issue 14",
      labels: [{ name: "enhancement", color: "#ffa500" }],
      state: "open",
      comments: 0,
      created_at: "2024-05-14T13:00:00Z",
      updated_at: "2024-05-14T13:00:00Z",
      closed_at: ""
    },
    {
      url: "https://github.com/example/repo/issues/15",
      id: 15,
      number: 15,
      title: "Example Issue 15",
      labels: [{ name: "bug", color: "#ff0000" }],
      state: "closed",
      comments: 1,
      created_at: "2024-05-15T11:30:00Z",
      updated_at: "2024-05-16T09:45:00Z",
      closed_at: "2024-05-16T09:45:00Z"
    },
    {
      url: "https://github.com/example/repo/issues/16",
      id: 16,
      number: 16,
      title: "Example Issue 16",
      labels: [{ name: "feature", color: "#00ff00" }],
      state: "open",
      comments: 3,
      created_at: "2024-05-16T08:20:00Z",
      updated_at: "2024-05-18T10:00:00Z",
      closed_at: ""
    },
    {
      url: "https://github.com/example/repo/issues/17",
      id: 17,
      number: 17,
      title: "Example Issue 17",
      labels: [{ name: "bug", color: "#ff0000" }],
      state: "open",
      comments: 0,
      created_at: "2024-05-17T15:15:00Z",
      updated_at: "2024-05-17T15:15:00Z",
      closed_at: ""
    },
    {
      url: "https://github.com/example/repo/issues/18",
      id: 18,
      number: 18,
      title: "Example Issue 18",
      labels: [{ name: "enhancement", color: "#ffa500" }],
      state: "closed",
      comments: 2,
      created_at: "2024-05-18T10:30:00Z",
      updated_at: "2024-05-19T09:00:00Z",
      closed_at: "2024-05-19T09:00:00Z"
    },
    {
      url: "https://github.com/example/repo/issues/19",
      id: 19,
      number: 19,
      title: "Example Issue 19",
      labels: [{ name: "bug", color: "#ff0000" }],
      state: "open",
      comments: 1,
      created_at: "2024-05-19T14:40:00Z",
      updated_at: "2024-05-20T12:30:00Z",
      closed_at: ""
    },
    {
      url: "https://github.com/example/repo/issues/20",
      id: 20,
      number: 20,
      title: "Example Issue 20",
      labels: [{ name: "feature", color: "#00ff00" }],
      state: "open",
      comments: 0,
      created_at: "2024-05-20T08:00:00Z",
      updated_at: "2024-05-20T08:00:00Z",
      closed_at: ""
    }
  ];
  
  export default dummyData;
  