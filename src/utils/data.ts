import {FormType} from "./types";

export const data = {
  nav_options: [
    {name: "Home", _id: "home", location: "/home"},
    {name: "Gigs", _id: "gigs", location: "/gigs"},
    {name: "Forms", _id: "forms", location: "/forms"},
    {name: "Store", _id: "store", location: "/store"},
    {name: "Users", _id: "users", location: "/users"},
  ],
};

export const fake_forms: FormType[] = [
  {
    id: "asj87",
    form: {
      name: "New form from",
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Modi corporis earum omnis laudantium aliquam ex dolores inventore, aperiam cupiditate! Quae nulla distinctio atque cupiditate ea labore voluptatibus molestias velit soluta.",
      sections: [
        {
          id: 1,
          options: [
            {name: "Option 1", _id: "option1"},
            {name: "Option 2", _id: "option2"},
          ],
          type: {name: "Multiple Choice", _id: "multiple_choice"},
          value: "Sample Value",
        },
      ],
    },
  },
];
