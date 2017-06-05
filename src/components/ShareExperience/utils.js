import R from 'ramda';

import {
  transferKeyToSnakecase,
} from 'utils/objectUtil';

const sortById = R.sortBy(R.prop('id'));

export const handleBlocks = R.compose(
  sortById,
  R.map(ele => ele[1]),
  R.toPairs
);

const propsInterviewForm = state => {
  const {
    companyQuery,
    region,
    jobTitle,
    experienceInYear,
    education,
    interviewTimeYear,
    interviewTimeMonth,
    interviewResult,
    salaryType,
    salaryAmount,
    overallRating,
    title,
    sections,
    interviewQas,
    interviewSensitiveQuestions,
  } = state;

  return {
    companyQuery,
    region,
    jobTitle,
    experienceInYear,
    education,
    interviewTimeYear,
    interviewTimeMonth,
    interviewResult,
    salaryType,
    salaryAmount,
    overallRating,
    title,
    sections: handleBlocks(sections),
    interviewQas: handleBlocks(interviewQas),
    interviewSensitiveQuestions,
  };
};

const needDeleteInterviewQas = R.compose(
    n => n === 1,
    R.length,
);

const filterEmptyInterviewQas = R.filter(
  R.allPass([
    R.compose(
      n => n !== 0,
      s => s.length,
      R.defaultTo(''),
      R.prop('question')
    ),
    R.compose(
      n => n !== 0,
      s => s.length,
      R.defaultTo(''),
      R.prop('answer')
    ),
  ])
);

const handleInterviewQas = interviewForm => {
  const data = {
    ...interviewForm,
    interviewQas: filterEmptyInterviewQas(interviewForm.interviewQas),
  };

  if (needDeleteInterviewQas(data)) {
    return R.omit(['interviewQas'])(data);
  }
  return data;
};

export const getInterviewForm = R.compose(
  handleInterviewQas,
  propsInterviewForm
);

export const portInterviewFormToRequestFormat = interviewForm => {
  let body = {
    ...interviewForm,
    interviewTime: {
      year: interviewForm.interviewTimeYear,
      month: interviewForm.interviewTimeMonth,
    },
    salary: {
      type: interviewForm.salaryType,
      amount: interviewForm.salaryAmount,
    },
  };

  body = R.omit([
    'interviewTimeYear',
    'interviewTimeMonth',
    'salaryType',
    'salaryAmount',
  ])(body);

  body = transferKeyToSnakecase(body);

  return body;
};