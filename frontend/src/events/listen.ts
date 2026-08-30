import { Events } from '@wailsio/runtime';
import type { Project } from '../../bindings/vvalio.dev/nyelvin/project';

/**
 * Mapping of event names to their types
 */
type EventTypes = {
  'project:open': { path: string; project: Project };
  'project:close': {};
  'project:save': { path?: string };
};

/**
 * Bare event info, without the data key.
 */
export type BareEventInfo = Events.WailsEvent<string>;

/**
 * A function type that takes the data and the event info
 */
export type EventListener<C> = (data: C, info: BareEventInfo) => void;

/**
 * Subscribes to an event with the given name. The returned function can be used to unsubscribe
 */
export const subscribe = <K extends keyof EventTypes>(
  name: K,
  listener: EventListener<EventTypes[K]>,
): (() => void) => {
  return Events.On(name, ev => {
    console.debug(`Received event ${name}`);
    listener(ev.data, ev);
  });
};
