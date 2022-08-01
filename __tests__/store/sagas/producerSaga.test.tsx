import api from '@/config/services/api';
import {getProducer, getProducerBaskets} from '@/store/sagas/producerSaga';
import {
  GET_PRODUCER_BASKET_FAILURE,
  GET_PRODUCER_BASKET_SUCCESS,
  GET_PRODUCER_FAILURE,
  GET_PRODUCER_SUCCESS,
  Producer,
  ProducerRequest,
} from '@/store/slices/producerSlice';
import {PayloadAction} from '@reduxjs/toolkit';
import {
  apiReturnProducerErrorMock,
  apiReturnProducerSuccessMock,
  invalidProducerID,
  producerBasketsMock,
  producerMock,
  validProducerID,
} from '@__mocks__/mockProducer';
import {runSaga, Saga} from 'redux-saga';

describe('producerSaga', () => {
  test('should return a producer with a valid id', async () => {
    const post = api.post as jest.Mock;
    const dispatchedAction: PayloadAction<Producer>[] = [];

    post.mockResolvedValueOnce(apiReturnProducerSuccessMock);

    await runSaga(
      {
        dispatch: (action: PayloadAction<Producer>) =>
          dispatchedAction.push(action),
      },
      getProducer as unknown as Saga<[{payload: ProducerRequest}]>,
      {payload: validProducerID},
    ).toPromise();

    expect(api.post).toHaveBeenCalledWith('/producers/', {
      params: validProducerID,
    });

    expect(dispatchedAction).toContainEqual(
      GET_PRODUCER_SUCCESS({producer: producerMock, status: 200}),
    );
  });

  test('should return a error with a invalid id', async () => {
    const post = api.post as jest.Mock;
    const dispatchedAction: PayloadAction<Producer>[] = [];

    post.mockRejectedValueOnce(apiReturnProducerErrorMock);

    await runSaga(
      {
        dispatch: (action: PayloadAction<Producer>) =>
          dispatchedAction.push(action),
      },
      getProducer as unknown as Saga<[{payload: ProducerRequest}]>,
      {payload: invalidProducerID},
    ).toPromise();

    expect(api.post).toHaveBeenCalledWith('/producers/', {
      params: invalidProducerID,
    });

    expect(dispatchedAction).toContainEqual(
      GET_PRODUCER_FAILURE({error: apiReturnProducerErrorMock}),
    );
  });

  test('should return baskets producer', async () => {
    const get = api.get as jest.Mock;
    const dispatchedAction: PayloadAction<Producer>[] = [];

    get.mockResolvedValueOnce(apiReturnProducerSuccessMock);

    await runSaga(
      {
        dispatch: (action: PayloadAction<Producer>) =>
          dispatchedAction.push(action),
      },
      getProducerBaskets as unknown as Saga,
      {payload: undefined},
    ).toPromise();

    expect(api.get).toHaveBeenCalledWith('/producers/get-producer-baskets');

    expect(dispatchedAction).toContainEqual(
      GET_PRODUCER_BASKET_SUCCESS({baskets: producerBasketsMock, status: 200}),
    );
  });

  test('should not return baskets producer with not authorized producer', async () => {
    const get = api.get as jest.Mock;
    const dispatchedAction: PayloadAction<Producer>[] = [];

    get.mockRejectedValueOnce({statusCode: 401, message: 'unauthorized'});

    await runSaga(
      {
        dispatch: (action: PayloadAction<Producer>) =>
          dispatchedAction.push(action),
      },
      getProducerBaskets as unknown as Saga,
      {payload: undefined},
    ).toPromise();

    expect(api.get).toHaveBeenCalledWith('/producers/get-producer-baskets');

    expect(dispatchedAction).toContainEqual(
      GET_PRODUCER_BASKET_FAILURE({
        error: {statusCode: 401, message: 'unauthorized'},
      }),
    );
  });
});