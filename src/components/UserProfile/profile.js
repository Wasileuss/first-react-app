import { useUserState } from '../../hooks/usePersistentState';
import { isPlainObject, isString } from '../../lib/validation';

export const PROFILE_FIELDS = [
  { name: 'first_name', label: 'First name', autoComplete: 'given-name' },
  { name: 'last_name', label: 'Last name', autoComplete: 'family-name' },
  { name: 'nick_name', label: 'Nickname', autoComplete: 'nickname' },
  { name: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel' },
  {
    name: 'gender',
    label: 'Gender',
    options: ['', 'Female', 'Male', 'Other', 'Prefer not to say'],
  },
  { name: 'age', label: 'Age', inputMode: 'numeric' },
  { name: 'country', label: 'Country', autoComplete: 'country-name' },
  { name: 'city', label: 'City', autoComplete: 'address-level2' },
];

export const EMPTY_PROFILE = Object.freeze(
  Object.fromEntries(PROFILE_FIELDS.map((f) => [f.name, ''])),
);

const isProfile = (v) => isPlainObject(v) && Object.values(v).every(isString);

export function useProfile() {
  const [stored, setProfile, error] = useUserState('profile', EMPTY_PROFILE, isProfile);
  // Keep only known fields, so extra keys in storage can't leak into the UI.
  const profile = Object.fromEntries(PROFILE_FIELDS.map((f) => [f.name, stored[f.name] ?? '']));
  return [profile, setProfile, error];
}
