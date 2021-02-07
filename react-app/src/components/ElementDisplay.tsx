interface ElementDisplayProps {
  name: string,
  value: string,
}

function ElementDisplay(props: ElementDisplayProps) {
  return (
    <tr className="ElementDisplay">
      <td><input type="text" readOnly value={props.name} /></td>
      <td><input type="text" readOnly value={props.value} /></td>
    </tr>
  );
}

export { ElementDisplay };