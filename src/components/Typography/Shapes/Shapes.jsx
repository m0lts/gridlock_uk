import './shapes.styles.css'

export const Parallelograms = ({ number, color }) => {
    const totalParallelograms = 5;

    const parallelograms = Array.from({ length: totalParallelograms }, (_, index) => (
        <div
            key={index}
            className="parallelogram"
            style={{ backgroundColor: index < number ? `var(--${color})` : 'var(--grey)' }}
        ></div>
    ));

    return <>{parallelograms}</>;
}