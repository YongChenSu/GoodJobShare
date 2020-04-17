import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  number,
  string,
  bool,
  func,
  shape,
  oneOf,
  oneOfType,
  element,
  arrayOf,
} from 'prop-types';
import cn from 'classnames';
import R from 'ramda';

import X from 'common/icons/X';

import QuestionBuilder, { availableTypes } from './QuestionBuilder';
import useDraft from './useDraft';
import TitleBlock from './TitleBlock';
import ProgressBlock from './ProgressBlock';
import NavigatorBlock from './NavigatorBlock';
import SubmissionBlock from './SubmissionBlock';
import AnimatedPager from './AnimatedPager';
import Scrollable from './Scrollable';
import styles from './FormBuilder.module.css';

const findWarningAgainstValue = (value, warning, validator) => {
  if (validator) {
    const isValid = validator(value);
    if (isValid) {
      return null;
    } else {
      if (typeof warning === 'function') {
        return warning(value);
      } else {
        return warning;
      }
    }
  } else {
    return null;
  }
};

const findIfQuestionsAcceptDraft = draft =>
  R.all(
    R.ifElse(
      R.has('validator'),
      R.converge(R.call, [
        R.prop('validator'),
        R.compose(
          dataKey => draft[dataKey],
          R.prop('dataKey'),
        ),
      ]),
      R.always(true),
    ),
  );

const FormBuilder = ({
  open,
  header: commonHeader,
  footer: commonFooter,
  questions,
  onChange,
  onPrev,
  onNext,
  onSubmit,
  onValidateFail,
  onClose,
}) => {
  const [draft, setDraftValue, resetDraft] = useDraft(questions);
  const handleDraftChange = dataKey => value => {
    if (onChange) onChange({ dataKey, value });
    setDraftValue(dataKey)(value);
  };

  const [page, setPage] = useState(0);
  const hasPrevious = page > 0;
  const hasNext = page < questions.length - 1;

  let header;
  let footer;
  let dataKey;
  let warning;
  let shouldRenderNothing = false;

  const [isWarningShown, setWarningShown] = useState(false);

  const isSubmittable = useMemo(
    () => findIfQuestionsAcceptDraft(draft)(questions),
    [draft, questions],
  );
  const handleSubmit = useCallback(() => {
    setWarningShown(true);
    if (warning) {
      if (onValidateFail)
        onValidateFail({ dataKey, value: draft[dataKey], warning });
    } else if (isSubmittable) {
      onSubmit(draft);
    } else {
      console.error(`Not submittable`);
    }
  }, [warning, isSubmittable, onValidateFail, dataKey, draft, onSubmit]);

  useEffect(() => {
    if (!open) {
      // Reset on close
      setPage(0);
      resetDraft();
      setWarningShown(false);
    }
  }, [open, resetDraft, setPage]);

  const question = questions[page];
  if (question) {
    header = question.header;
    footer = question.footer;
    dataKey = question.dataKey;
    warning = findWarningAgainstValue(
      draft[dataKey],
      question.warning,
      question.validator,
    );
  } else {
    shouldRenderNothing = true;
  }

  const warnBeforeSetPage = useCallback(
    page => {
      setWarningShown(true);
      if (warning) {
        if (onValidateFail)
          onValidateFail({ dataKey, value: draft[dataKey], warning });
      } else {
        setPage(page);
      }
    },
    [dataKey, draft, onValidateFail, setPage, warning],
  );

  useEffect(() => {
    setWarningShown(false);
  }, [page]);

  if (shouldRenderNothing) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.closeBtn} onClick={onClose}>
          <X className={styles.icon} />
        </button>
        {header || commonHeader}
      </div>
      <div className={styles.body}>
        <AnimatedPager className={styles.pager} page={page}>
          {questions.map(({ header, footer, ...restOptions }, i) => (
            <AnimatedPager.Page key={restOptions.dataKey}>
              <div className={styles.question}>
                <div>
                  <TitleBlock
                    page={i}
                    title={restOptions.title}
                    description={restOptions.description}
                    required={restOptions.required}
                  />
                </div>
                <Scrollable className={styles.answer}>
                  <QuestionBuilder
                    {...restOptions}
                    page={i}
                    value={draft[restOptions.dataKey]}
                    onChange={handleDraftChange(restOptions.dataKey)}
                    onConfirm={() => {
                      if (onNext) onNext();
                      warnBeforeSetPage(i + 1);
                    }}
                    warning={isWarningShown ? warning : null}
                  />
                </Scrollable>
              </div>
            </AnimatedPager.Page>
          ))}
        </AnimatedPager>
        <div className={styles.navigationBar}>
          <div>
            <ProgressBlock page={page} totalPages={questions.length} />
          </div>
          <div className={styles.navigator}>
            <NavigatorBlock
              onPrevious={() => {
                if (onPrev) onPrev();
                warnBeforeSetPage(page - 1);
              }}
              onNext={() => {
                if (onNext) onNext();
                warnBeforeSetPage(page + 1);
              }}
              hasPrevious={hasPrevious}
              hasNext={hasNext}
            />
          </div>
        </div>
        <div
          className={cn(styles.submission, {
            [styles.visible]: !hasNext,
          })}
        >
          <SubmissionBlock onSubmit={handleSubmit} />
        </div>
      </div>
      <div>{footer || commonFooter}</div>
    </div>
  );
};

FormBuilder.propTypes = {
  open: bool.isRequired,
  header: oneOfType([string, element]),
  footer: oneOfType([string, element]),
  questions: arrayOf(
    shape({
      header: oneOfType([string, element]),
      footer: oneOfType([string, element]),
      title: oneOfType([string, func]).isRequired,
      description: string,
      type: oneOf(availableTypes).isRequired,
      dataKey: string.isRequired,
      required: bool,
      warning: oneOfType([func, string]),
      validator: func,
      placeholder: string,
      minLength: number,
      options: arrayOf(string),
      maxRating: number,
      renderCustomizedQuestion: func,
    }),
  ).isRequired,
  onChange: func,
  onPrev: func,
  onNext: func,
  onSubmit: func.isRequired,
  onValidateFail: func,
  onClose: func,
};

FormBuilder.defaultProps = {
  open: false,
  questions: [],
  onSubmit: console.log,
};

const withBackgroundMask = Modal => props => (
  <div className={cn(styles.backgroundMask, { [styles.hidden]: !props.open })}>
    <Modal {...props} />
  </div>
);

export default withBackgroundMask(FormBuilder);