export function toggleBusketVisibility(aside: useRefMutableObject, main: useRefMutableObject) {
  if (aside.current.style.display === 'none') {
    aside.current.style.display = 'block'
    main.current.style.display = 'none'
  } else {
    aside.current.style.display = 'none'
    main.current.style.display = 'block'
  }
}

export function toggleBusketVisibilityForWideScreenAndCalendar(aside: useRefMutableObject) {
  if (aside.current.style.display === 'none') {
    aside.current.style.display = 'block'
  } else {
    aside.current.style.display = 'none'
  }
}

export type useRefMutableObject = React.MutableRefObject<HTMLElement | null>