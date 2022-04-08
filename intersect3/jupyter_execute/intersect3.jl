intersect3_v1(A,B,C) = intersect(intersect(A,B),C)

function intersect3_v2(A,B,C)
    lenA,lenB,lenC = length(A),length(B),length(C)
    if lenA <= lenB
        if lenB <= lenC
            return intersect(intersect(A,B),C)
        else
            return (lenA <= lenC ? intersect(intersect(A,C),B) 
                                 : intersect(intersect(C,A),B))
        end
    else # lenB < lenA
        if lenA <= lenC
            return intersect(intersect(B,A),C)
        else
            return (lenB <= lenC ? intersect(intersect(B,C),A)
                                 : intersect(intersect(C,B),A))
        end
    end
end

using BenchmarkTools

b1 = @benchmarkable intersect3_v1(A,B,C)  setup=(
    A = unique(rand(1:3000000,rand(100:90000))); 
    B = unique(rand(1:3000000,rand(100:90000)));
    C = unique(rand(1:3000000,rand(100:90000))))
tune!(b1)
run(b1)

b2 = @benchmarkable intersect3_v2(A,B,C)  setup=(
    A = unique(rand(1:3000000,rand(100:90000))); 
    B = unique(rand(1:3000000,rand(100:90000)));
    C = unique(rand(1:3000000,rand(100:90000))))
tune!(b2)
run(b2)

function intersect3_v3(A,B,C; N=1_000_000)
    cnt = zeros(Int,N)
    cnt[A] .+= 1
    cnt[B] .+= 1
    cnt[C] .+= 1
    return findall(cnt.==3)
end

b3 = @benchmarkable intersect3_v3(A,B,C;N=3000000)  setup=(
    A = unique(rand(1:3000000,rand(100:90000))); 
    B = unique(rand(1:3000000,rand(100:90000)));
    C = unique(rand(1:3000000,rand(100:90000))))
tune!(b3)
run(b3)

b2 = @benchmarkable intersect3_v2(A,B,C)  setup=(
    A = unique(rand(1:10000,rand(100:9000))); 
    B = unique(rand(1:10000,rand(100:9000)));
    C = unique(rand(1:10000,rand(100:9000))))
tune!(b2)
run(b2)

b3 = @benchmarkable intersect3_v3(A,B,C;N=10000)  setup=(
    A = unique(rand(1:10000,rand(100:9000))); 
    B = unique(rand(1:10000,rand(100:9000)));
    C = unique(rand(1:10000,rand(100:9000))))
tune!(b3)
run(b3)

function bisec(a::Int, b::Int, x::Int, Lref::Base.RefValue{Vector{Int64}})::Int
    (x <  Lref[][a]) && (return a-1)
    (x >= Lref[][b]) && (return b)
    c = 0
    while b - a > 1
        c = (a + b) ÷ 2
        if x < Lref[][c]
            b = c
        else
            a = c
        end
    end
    x < Lref[][b] ? a : b
end

function ord3!(ord,s,t)
    if s[1]-t[1] <= s[2]-t[2]
        return (s[2]-t[2] <= s[3]-t[3] 
                    ? (ord[1]=1; ord[2]=2; ord[3]=3;)
                    : (s[1]-t[1] <= s[3]-t[3] 
                            ? (ord[1]=1;ord[2]=3;ord[3]=2;) 
                            : (ord[1]=3;ord[2]=1;ord[3]=2;)))
    else # s[2] < s[1]
        return (s[1]-t[1] <= s[3]-t[3] 
                    ? (ord[1]=2;ord[2]=1;ord[3]=3;)
                    : (s[2]-t[2] <= s[3]-t[3] 
                            ? (ord[1]=2;ord[2]=3;ord[3]=1;) 
                            : (ord[1]=3;ord[2]=2;ord[3]=1;)))
    end    
end

allposv(v) = v[1]>0 && v[2]>0 && v[3]>0

function intersect3_v4(A,B,C)
    # profiling shows that the major efforts are sorting
    As = sort(A)
    Bs = sort(B)
    Cs = sort(C)
    # use reference to avoid allocations
    Lref = [Ref(As),Ref(Bs),Ref(Cs)] ;
    # preparations
    maxt = maximum(r->first(r[]), Lref)
    mint = minimum(r->last(r[]), Lref)
    head = [bisec(1,length(r[]),maxt,r) for r in Lref]
    tail = [bisec(1,length(r[]),mint,r) for r in Lref]
    s = [-1,-1,-1]  #+ reduce alloc
    ord3!(s, tail, head)  #+ reduce alloc
    if !(allposv(head) && head[s[1]]<=tail[s[1]])
        return []
    end
    intsct = zeros(Int,minimum(tail.-head))
    p = 1
    while allposv(head) && head[s[1]]<=tail[s[1]]
        ord3!(s, tail, head)  #+ reduce alloc
        a = Lref[s[1]][][head[s[1]]]
        head[s[1]] = head[s[1]]+1
        # search in L[head:tail]
        i2 = bisec(head[s[2]], tail[s[2]], a, Lref[s[2]])
        if i2 < head[s[2]]
            # outside range head:tail
            continue
        elseif a != Lref[s[2]][][i2]
            head[s[2]] = i2+1
            continue
        else # a == Lref[s[2]][][i2]
            i3 = bisec(head[s[3]], tail[s[3]], a, Lref[s[3]])
            if i3 < head[s[3]]
                head[s[2]] = i2+1
                continue
            else
                if a == Lref[s[3]][][i3]
                    intsct[p] = a
                    p += 1
                end
                head[s[2]] = i2+1
                head[s[3]] = i3+1
                continue
            end
        end
    end
    intsct[1:(p-1)]
end


for i=1:10000
    A = unique(rand(1:3000,rand(300:5000)))
    B = unique(rand(1:1000,rand(300:5000)))
    C = unique(rand(1:6000,rand(300:5000)))
    @assert sort(intersect3_v2(A,B,C))==intersect3_v4(A,B,C) 
end

b2 = @benchmarkable intersect3_v2(A,B,C)  setup=(
    A = unique(rand(1:10000,rand(100:9000))); 
    B = unique(rand(1:10000,rand(100:9000)));
    C = unique(rand(1:10000,rand(100:9000))))
tune!(b2)
run(b2)

b4 = @benchmarkable intersect3_v4(A,B,C)  setup=(
    A = unique(rand(1:10000,rand(100:9000))); 
    B = unique(rand(1:10000,rand(100:9000)));
    C = unique(rand(1:10000,rand(100:9000))))
tune!(b4)
run(b4)

b2 = @benchmarkable intersect3_v2(A,B,C)  setup=(
    A = unique(rand(1:3000000,rand(100:90000))); 
    B = unique(rand(1:3000000,rand(100:90000)));
    C = unique(rand(1:3000000,rand(100:90000))))
tune!(b2)
run(b2)

b4 = @benchmarkable intersect3_v4(A,B,C)  setup=(
    A = unique(rand(1:3000000,rand(100:90000))); 
    B = unique(rand(1:3000000,rand(100:90000)));
    C = unique(rand(1:3000000,rand(100:90000))))
tune!(b4)
run(b4)

# for sorted integer lists
function intersect3_v4s(As,Bs,Cs)
    # use reference to avoid allocations
    Lref = [Ref(As),Ref(Bs),Ref(Cs)] ;
    # preparations
    maxt = maximum(r->first(r[]), Lref)
    mint = minimum(r->last(r[]), Lref)
    head = [bisec(1,length(r[]),maxt,r) for r in Lref]
    tail = [bisec(1,length(r[]),mint,r) for r in Lref]
    s = [-1,-1,-1]  #+ reduce alloc
    ord3!(s, tail, head)  #+ reduce alloc
    if !(allposv(head) && head[s[1]]<=tail[s[1]])
        return []
    end
    intsct = zeros(Int,minimum(tail.-head))
    p = 1
    while allposv(head) && head[s[1]]<=tail[s[1]]
        ord3!(s, tail, head)  #+ reduce alloc
        a = Lref[s[1]][][head[s[1]]]
        head[s[1]] = head[s[1]]+1
        # search in L[head:tail]
        i2 = bisec(head[s[2]], tail[s[2]], a, Lref[s[2]])
        if i2 < head[s[2]]
            # outside range head:tail
            continue
        elseif a != Lref[s[2]][][i2]
            head[s[2]] = i2+1
            continue
        else # a == Lref[s[2]][][i2]
            i3 = bisec(head[s[3]], tail[s[3]], a, Lref[s[3]])
            if i3 < head[s[3]]
                head[s[2]] = i2+1
                continue
            else
                if a == Lref[s[3]][][i3]
                    intsct[p] = a
                    p += 1
                end
                head[s[2]] = i2+1
                head[s[3]] = i3+1
                continue
            end
        end
    end
    intsct[1:(p-1)]
end


b4s = @benchmarkable intersect3_v4s(As,Bs,Cs)  setup=(
    As = sort(unique(rand(1:3000000,rand(100:90000)))); 
    Bs = sort(unique(rand(1:3000000,rand(100:90000))));
    Cs = sort(unique(rand(1:3000000,rand(100:90000)))))
tune!(b4s)
run(b4s)

b4 = @benchmarkable intersect3_v4(As,Bs,Cs)  setup=(
    As = sort(unique(rand(1:3000000,rand(100:90000)))); 
    Bs = sort(unique(rand(1:3000000,rand(100:90000))));
    Cs = sort(unique(rand(1:3000000,rand(100:90000)))))
tune!(b4)
run(b4)

b2 = @benchmarkable intersect3_v2(As,Bs,Cs)  setup=(
    As = sort(unique(rand(1:3000000,rand(100:90000)))); 
    Bs = sort(unique(rand(1:3000000,rand(100:90000))));
    Cs = sort(unique(rand(1:3000000,rand(100:90000)))))
tune!(b2)
run(b2)
