import { useState, useRef, useEffect, type JSX } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { BsSearch, BsX } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useGetProductsQuery } from './productsApi';
import { useDebounce } from '../../hooks/useDebounce';
import { formatPrice, getProductDisplayName } from '../../lib/utils';

const GlobalSearch = (): JSX.Element => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const debouncedQuery = useDebounce(query, 300);

    const { data: paged } = useGetProductsQuery(
        { searchTerm: debouncedQuery, pageSize: 6 },
        { skip: debouncedQuery.length < 2 }
    );

    useEffect(() => {
        const handler = (e: MouseEvent): void => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        if (debouncedQuery.length >= 2 && (paged?.items.length ?? 0) > 0) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [debouncedQuery, paged]);

    const handleSelect = (productId: number): void => {
        setQuery('');
        setOpen(false);
        navigate(`/products/${productId}`);
    };

    const handleShowAll = (): void => {
        if (!query.trim()) return;
        setOpen(false);
        navigate(`/catalog?searchTerm=${encodeURIComponent(query.trim())}`);
        setQuery('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') handleShowAll();
        if (e.key === 'Escape') { setOpen(false); inputRef.current?.blur(); }
    };

    const handleClear = (): void => {
        setQuery('');
        setOpen(false);
        inputRef.current?.focus();
    };

    return (
        <div className="global-search" ref={wrapperRef}>
            <InputGroup>
                <InputGroup.Text className="search-addon">
                    <BsSearch size={14} className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                    ref={inputRef}
                    placeholder="Пошук товарів..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => { if (debouncedQuery.length >= 2 && paged?.items.length) setOpen(true); }}
                    onKeyDown={handleKeyDown}
                    className="search-input border-start-0"
                    aria-label="Пошук"
                />
                {query && (
                    <button className="search-clear btn" onClick={handleClear} tabIndex={-1} aria-label="Очистити">
                        <BsX size={18} className="text-muted" />
                    </button>
                )}
            </InputGroup>

            {open && paged && paged.items.length > 0 && (
                <div className="search-dropdown shadow-lg">
                    {paged.items.map((product) => (
                        <div
                            key={product.id}
                            className="search-item"
                            onMouseDown={() => handleSelect(product.id)}
                        >
                            <img
                                src={product.imageUrl ?? '/placeholder.svg'}
                                alt={product.name}
                                className="search-item-img"
                            />
                            <div className="search-item-info">
                                <div className="search-item-name">
                                    {getProductDisplayName(product.name, product.categoryName)}
                                </div>
                                <small className="text-muted">
                                    {product.brandName} · {product.categoryName}
                                </small>
                            </div>
                            <div className="search-item-price fw-semibold text-primary">
                                {formatPrice(product.price)}
                            </div>
                        </div>
                    ))}
                    {(paged.totalCount > 6 || paged.totalCount === 6) && (
                        <div className="search-show-all" onMouseDown={handleShowAll}>
                            Показати всі результати ({paged.totalCount}) →
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GlobalSearch;