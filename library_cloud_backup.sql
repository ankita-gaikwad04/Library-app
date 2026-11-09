--
-- PostgreSQL database dump
--

\restrict BO7yxn9TpEsAmTfSV2gZIjy3p60vQy04SlSHcz8gsc42IeIgYbw9F8WSw9xt0JE

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: book_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.book_requests (
    request_id integer NOT NULL,
    book_id integer,
    member_id integer,
    status character varying(20) DEFAULT 'pending'::character varying,
    request_date date DEFAULT CURRENT_DATE
);


ALTER TABLE public.book_requests OWNER TO postgres;

--
-- Name: book_requests_request_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.book_requests_request_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.book_requests_request_id_seq OWNER TO postgres;

--
-- Name: book_requests_request_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.book_requests_request_id_seq OWNED BY public.book_requests.request_id;


--
-- Name: books; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.books (
    book_id integer NOT NULL,
    book_name character varying(100) NOT NULL,
    author character varying(100) NOT NULL,
    quantity integer NOT NULL
);


ALTER TABLE public.books OWNER TO postgres;

--
-- Name: books_book_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.books_book_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.books_book_id_seq OWNER TO postgres;

--
-- Name: books_book_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.books_book_id_seq OWNED BY public.books.book_id;


--
-- Name: issued_books; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.issued_books (
    issue_id integer NOT NULL,
    book_id integer,
    member_id integer,
    issue_date date DEFAULT CURRENT_DATE,
    return_date date
);


ALTER TABLE public.issued_books OWNER TO postgres;

--
-- Name: issued_books_issue_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.issued_books_issue_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.issued_books_issue_id_seq OWNER TO postgres;

--
-- Name: issued_books_issue_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.issued_books_issue_id_seq OWNED BY public.issued_books.issue_id;


--
-- Name: members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.members (
    member_id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100),
    phone character varying(10)
);


ALTER TABLE public.members OWNER TO postgres;

--
-- Name: members_member_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.members_member_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.members_member_id_seq OWNER TO postgres;

--
-- Name: members_member_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.members_member_id_seq OWNED BY public.members.member_id;


--
-- Name: book_requests request_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_requests ALTER COLUMN request_id SET DEFAULT nextval('public.book_requests_request_id_seq'::regclass);


--
-- Name: books book_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books ALTER COLUMN book_id SET DEFAULT nextval('public.books_book_id_seq'::regclass);


--
-- Name: issued_books issue_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issued_books ALTER COLUMN issue_id SET DEFAULT nextval('public.issued_books_issue_id_seq'::regclass);


--
-- Name: members member_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.members ALTER COLUMN member_id SET DEFAULT nextval('public.members_member_id_seq'::regclass);


--
-- Data for Name: book_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.book_requests VALUES (1, 1, 1, 'approved', '2026-11-07');
INSERT INTO public.book_requests VALUES (2, 1, 1, 'approved', '2026-11-07');
INSERT INTO public.book_requests VALUES (3, 1, 1, 'approved', '2026-11-07');


--
-- Data for Name: books; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.books VALUES (4, 'Java', 'CCC', 3);
INSERT INTO public.books VALUES (5, 'Python', 'DDD', 6);
INSERT INTO public.books VALUES (6, 'AI', 'QQ', 2);
INSERT INTO public.books VALUES (1, 'CSS1', 'AAA12', 0);


--
-- Data for Name: issued_books; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.issued_books VALUES (1, 1, 2, '2026-11-06', NULL);
INSERT INTO public.issued_books VALUES (3, 1, 1, '2026-11-07', '2026-11-21');
INSERT INTO public.issued_books VALUES (2, 1, 1, '2026-11-07', '2026-11-07');
INSERT INTO public.issued_books VALUES (4, 1, 1, '2026-11-07', '2026-11-21');
INSERT INTO public.issued_books VALUES (5, 1, 1, '2026-11-07', '2026-11-21');


--
-- Data for Name: members; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.members VALUES (1, 'Ankita', 'ankita@gmail.com', '1234567');
INSERT INTO public.members VALUES (2, 'Shrav', 'shrav@gmail.com', '34567899');


--
-- Name: book_requests_request_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.book_requests_request_id_seq', 3, true);


--
-- Name: books_book_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.books_book_id_seq', 6, true);


--
-- Name: issued_books_issue_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.issued_books_issue_id_seq', 5, true);


--
-- Name: members_member_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.members_member_id_seq', 2, true);


--
-- Name: book_requests book_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_requests
    ADD CONSTRAINT book_requests_pkey PRIMARY KEY (request_id);


--
-- Name: books books_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_pkey PRIMARY KEY (book_id);


--
-- Name: issued_books issued_books_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issued_books
    ADD CONSTRAINT issued_books_pkey PRIMARY KEY (issue_id);


--
-- Name: members members_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_email_key UNIQUE (email);


--
-- Name: members members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_pkey PRIMARY KEY (member_id);


--
-- Name: book_requests book_requests_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_requests
    ADD CONSTRAINT book_requests_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(book_id);


--
-- Name: book_requests book_requests_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_requests
    ADD CONSTRAINT book_requests_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(member_id);


--
-- Name: issued_books issued_books_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issued_books
    ADD CONSTRAINT issued_books_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(book_id);


--
-- Name: issued_books issued_books_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issued_books
    ADD CONSTRAINT issued_books_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(member_id);


--
-- PostgreSQL database dump complete
--

\unrestrict BO7yxn9TpEsAmTfSV2gZIjy3p60vQy04SlSHcz8gsc42IeIgYbw9F8WSw9xt0JE

