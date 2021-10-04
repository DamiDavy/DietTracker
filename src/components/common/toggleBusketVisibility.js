export function toggleBusketVisibility(aside, main) {
  if (aside.current.style.display === 'none') {
    aside.current.style.display = 'block'
    main.current.style.display = 'none'
  } else {
    aside.current.style.display = 'none'
    main.current.style.display = 'block'
  }
}

export function toggleBusketVisibilityForWideScreenAndCalendar(aside) {
  if (aside.current.style.display === 'none') {
    aside.current.style.display = 'block'
  } else {
    aside.current.style.display = 'none'
  }
}