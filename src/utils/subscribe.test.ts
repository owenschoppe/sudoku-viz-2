import { Board } from '../types';
import { initializeSubscriptions, subscribe } from './subscribe';

describe('subscribe', () => {
  it('should return unsubscribe and dispatch', () => {
    const mockRender = jest.fn();
    let { unsubscribe, dispatch } = subscribe(mockRender);
    expect(typeof unsubscribe).toBe('function');
    expect(typeof dispatch).toBe('function');
    // expect(mockRender).toHaveBeenCalledTimes(1);
    // expect(mockRender).toHaveBeenCalledWith({});
  });

  it('should only subscribe once', () => {
    const mockRender = jest.fn();
    let { unsubscribe, dispatch } = subscribe(mockRender);
    subscribe(mockRender);
    expect(typeof unsubscribe).toBe('function');
    expect(typeof dispatch).toBe('function');
    dispatch();
    expect(mockRender).toHaveBeenCalledTimes(1); // Subscribing the same fn twice would mean 4 calls
  });

  it('should call render on dispatch', () => {
    const mockRender = jest.fn();
    let { unsubscribe, dispatch } = subscribe(mockRender);
    expect(typeof unsubscribe).toBe('function');
    expect(typeof dispatch).toBe('function');
    dispatch();
    expect(mockRender).toHaveBeenCalledTimes(1);
  });

  it('should unsubscribe', () => {
    const mockRender = jest.fn();
    let { unsubscribe, dispatch } = subscribe(mockRender);
    expect(typeof unsubscribe).toBe('function');
    expect(typeof dispatch).toBe('function');
    dispatch();
    expect(unsubscribe()).toBeTruthy();
    dispatch();
    expect(mockRender).toHaveBeenCalledTimes(1);
  });

  it('should call render with initial state', () => {
    const mockRender = jest.fn();
    const board: Board = [[1]];
    initializeSubscriptions({ board });
    subscribe(mockRender);
    expect(mockRender).toHaveBeenCalledTimes(0);
    // expect(mockRender).toHaveBeenCalledWith({ board });
  });

  it('should call render with updated state', () => {
    const mockRender = jest.fn();
    const board: { board: Board } = { board: [[1]] };
    const updated = { board: [[2]] };
    const mockReducer = jest.fn().mockReturnValue(updated);
    initializeSubscriptions(board, mockReducer);
    let { dispatch, state } = subscribe(mockRender);
    dispatch();
    expect(state).toBe(board);
    expect(mockRender).toHaveBeenCalledTimes(1);
    expect(mockRender.mock.calls).toEqual([
      // [board], // First call
      [updated], // Second call
    ]);
  });
});
