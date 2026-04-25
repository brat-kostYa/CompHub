import { Col, Row } from 'react-bootstrap';
import { useGetProductsQuery } from '../catalog/productsApi';
import ProductCard from '../catalog/ProductCard';

interface Props {
    categoryId: number;
    currentProductId: number;
}

const RelatedProducts = ({ categoryId, currentProductId }: Props) => {
    const { data: paged, isLoading } = useGetProductsQuery({ categoryId, pageSize: 5, page: 1 });

    const items = paged?.items.filter((p) => p.id !== currentProductId).slice(0, 4) ?? [];

    if (isLoading || items.length === 0) return null;

    return (
        <Row className="mt-5">
            <Col>
                <h4 className="fw-bold mb-3">Схожі товари</h4>
                <Row xs={2} md={4} className="g-3">
                    {items.map((product) => (
                        <Col key={product.id}>
                            <ProductCard product={product} />
                        </Col>
                    ))}
                </Row>
            </Col>
        </Row>
    );
};

export default RelatedProducts;